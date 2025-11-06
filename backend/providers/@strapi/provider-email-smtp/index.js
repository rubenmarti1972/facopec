'use strict';

const net = require('node:net');
const tls = require('node:tls');

const DEFAULT_TIMEOUT_MS = 15000;

const formatAddressList = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) =>
      typeof entry === 'string' ? entry.split(',').map((item) => item.trim()).filter(Boolean) : []
    );
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
};

const ensureValue = (value, fallback) => (value == null || value === '' ? fallback : value);

const buildMessage = (options, settings) => {
  const to = formatAddressList(options.to);
  const cc = formatAddressList(options.cc);
  const bcc = formatAddressList(options.bcc);
  const replyTo = ensureValue(options.replyTo, settings.defaultReplyTo);
  const from = ensureValue(options.from, settings.defaultFrom);

  const headers = [];
  headers.push(`From: ${from}`);
  if (to.length > 0) {
    headers.push(`To: ${to.join(', ')}`);
  }
  if (cc.length > 0) {
    headers.push(`Cc: ${cc.join(', ')}`);
  }
  if (replyTo) {
    headers.push(`Reply-To: ${replyTo}`);
  }
  if (options.subject) {
    headers.push(`Subject: ${options.subject}`);
  }
  headers.push('MIME-Version: 1.0');

  let body = '';
  if (options.html) {
    headers.push('Content-Type: text/html; charset=UTF-8');
    body = options.html;
  } else if (options.text) {
    headers.push('Content-Type: text/plain; charset=UTF-8');
    body = options.text;
  } else {
    headers.push('Content-Type: text/plain; charset=UTF-8');
    body = '';
  }

  return `${headers.join('\r\n')}\r\n\r\n${body}`;
};

const createConnection = ({ host, port, secure }) =>
  new Promise((resolve, reject) => {
    const socket = (secure ? tls : net).connect({ host, port }, () => resolve(socket));

    socket.setTimeout(DEFAULT_TIMEOUT_MS, () => {
      socket.destroy(new Error('SMTP connection timed out'));
    });

    socket.once('error', (error) => {
      reject(error);
    });
  });

const readResponse = (socket) =>
  new Promise((resolve, reject) => {
    let buffer = '';

    const onData = (chunk) => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split('\r\n');
      const lastLine = lines[lines.length - 2];

      if (!lastLine) {
        return;
      }

      if (/^\d{3} [\s\S]*$/.test(lastLine)) {
        socket.off('data', onData);
        resolve({
          code: Number.parseInt(lastLine.slice(0, 3), 10),
          message: buffer.trimEnd()
        });
      }
    };

    const onError = (error) => {
      socket.off('data', onData);
      reject(error);
    };

    socket.on('data', onData);
    socket.once('error', onError);
  });

const writeCommand = async (socket, command, expectedCodes) => {
  socket.write(`${command}\r\n`);
  const response = await readResponse(socket);
  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP command failed (${command.split(' ')[0]}): ${response.message}`);
  }
};

const authenticateIfNeeded = async (socket, auth) => {
  if (!auth || !auth.user || !auth.pass) {
    return;
  }

  const username = Buffer.from(auth.user, 'utf8').toString('base64');
  const password = Buffer.from(auth.pass, 'utf8').toString('base64');

  await writeCommand(socket, 'AUTH LOGIN', [235, 334]);
  const userResponse = await readResponse(socket);
  if (userResponse.code !== 334) {
    throw new Error(`Unexpected SMTP response during AUTH LOGIN: ${userResponse.message}`);
  }
  socket.write(`${username}\r\n`);
  const passResponse = await readResponse(socket);
  if (passResponse.code !== 334 && passResponse.code !== 235) {
    throw new Error(`Unexpected SMTP username response: ${passResponse.message}`);
  }
  if (passResponse.code === 334) {
    socket.write(`${password}\r\n`);
    const finalResponse = await readResponse(socket);
    if (finalResponse.code !== 235) {
      throw new Error(`SMTP authentication failed: ${finalResponse.message}`);
    }
  }
};

const sendEnvelopeAddresses = async (socket, command, addresses) => {
  for (const address of addresses) {
    await writeCommand(socket, `${command}:<${address}>`, [250, 251]);
  }
};

const sendMailThroughSmtp = async (providerOptions, mail, settings) => {
  const host = providerOptions.host;
  const port = providerOptions.port ?? (providerOptions.secure ? 465 : 587);
  if (!host) {
    throw new Error('SMTP host is required');
  }

  const socket = await createConnection({ host, port, secure: providerOptions.secure });
  try {
    await readResponse(socket); // server greeting
    await writeCommand(socket, `EHLO ${host}`, [250]);
    await authenticateIfNeeded(socket, providerOptions.auth);

    const from = ensureValue(mail.from, settings.defaultFrom);
    if (!from) {
      throw new Error('Email "from" address is required');
    }

    const toRecipients = formatAddressList(mail.to);
    const ccRecipients = formatAddressList(mail.cc);
    const bccRecipients = formatAddressList(mail.bcc);
    const allRecipients = [...toRecipients, ...ccRecipients, ...bccRecipients];
    if (allRecipients.length === 0) {
      throw new Error('At least one recipient (to, cc or bcc) is required');
    }

    await writeCommand(socket, `MAIL FROM:<${from}>`, [250]);
    await sendEnvelopeAddresses(socket, 'RCPT TO', allRecipients);

    await writeCommand(socket, 'DATA', [354]);
    const message = buildMessage(mail, settings);
    socket.write(`${message}\r\n.\r\n`);
    const dataResponse = await readResponse(socket);
    if (dataResponse.code !== 250) {
      throw new Error(`SMTP DATA command failed: ${dataResponse.message}`);
    }

    await writeCommand(socket, 'QUIT', [221]);
  } finally {
    socket.end();
  }
};

module.exports = {
  init(providerOptions = {}, settings = {}) {
    return {
      async send(options = {}) {
        await sendMailThroughSmtp(providerOptions, options, settings);
      }
    };
  }
};
