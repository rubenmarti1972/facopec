/**
 * Email controller for FACOPEC
 * Handles sending emails from contact forms, partnership requests, etc.
 *
 * Updated to use Brevo HTTP API because SMTP connections time out on Render free tier.
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export default {
  async send(ctx) {
    const { to, subject, html, text, from, replyTo } = ctx.request.body || {};

    if (!to || !subject) {
      return ctx.badRequest('Missing required fields: "to" and "subject" are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return ctx.badRequest('Invalid email format for "to" field');
    }

    if (replyTo && !emailRegex.test(replyTo)) {
      return ctx.badRequest('Invalid email format for "replyTo" field');
    }

    if (from && !emailRegex.test(from)) {
      return ctx.badRequest('Invalid email format for "from" field');
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_FROM;
    const replyToEmail = replyTo || process.env.EMAIL_REPLY_TO || senderEmail;

    if (!brevoApiKey) {
      strapi.log.error('BREVO_API_KEY is not configured; cannot send email');
      return ctx.internalServerError('Email service is not configured. Please contact the administrator.');
    }

    if (!senderEmail) {
      strapi.log.error('EMAIL_FROM is not configured; cannot send email');
      return ctx.internalServerError('Sender email is not configured. Please contact the administrator.');
    }

    const payload = {
      sender: {
        email: senderEmail,
        name: 'FACOPEC',
      },
      to: [
        { email: to },
      ],
      subject,
      htmlContent: html ?? text ?? '',
      textContent: text ?? '',
      replyTo: replyToEmail
        ? {
            email: replyToEmail,
          }
        : undefined,
    };

    try {
      const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData;

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          strapi.log.warn('Could not parse Brevo response JSON', {
            responseText,
            error: parseError instanceof Error ? parseError.message : parseError,
          });
        }
      }

      if (!response.ok) {
        strapi.log.error('Failed to send email via Brevo', {
          status: response.status,
          statusText: response.statusText,
          to,
          subject,
          brevoResponse: responseData ?? responseText,
        });

        return ctx.internalServerError({
          data: null,
          error: `Failed to send email via Brevo (status ${response.status}). Please try again later.`,
        });
      }

      strapi.log.info('Email sent successfully via Brevo', {
        to,
        subject,
        messageId: responseData?.messageId,
      });

      return ctx.send({
        data: { sent: true },
        error: null,
      });
    } catch (error) {
      strapi.log.error('Error sending email via Brevo', error);

      return ctx.internalServerError({
        data: null,
        error: 'Unexpected error while sending email. Please try again later.',
      });
    }
  },
};
