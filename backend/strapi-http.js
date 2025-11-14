const { URL } = require('node:url');

const DEFAULT_BASE_URL = (process.env.STRAPI_BASE_URL ?? 'http://localhost:1337').replace(/\/$/, '');
const DEFAULT_ADMIN_EMAIL = process.env.STRAPI_ADMIN_EMAIL ?? 'admin@facopec.org';
const DEFAULT_ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD ?? 'Admin123456';

const IPV6_LOCALHOST_CODES = new Set(['ECONNREFUSED', 'EHOSTUNREACH', 'ENOTFOUND']);

function ensureLeadingSlash(path) {
  if (!path) {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

function buildFallbackUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (parsed.hostname !== 'localhost') {
      return null;
    }
    parsed.hostname = '127.0.0.1';
    return parsed.toString();
  } catch (error) {
    return null;
  }
}

function enhanceFetchError(error, url) {
  if (!error || !error.cause) {
    return error;
  }

  const { code, address, port } = error.cause;
  const details = [code, address, port].filter(Boolean).join(' ');
  const message = details
    ? `No se pudo conectar a ${url} (${details}): ${error.message}`
    : `No se pudo conectar a ${url}: ${error.message}`;

  const enhanced = new Error(message);
  enhanced.cause = error.cause;
  return enhanced;
}

async function fetchWithAutoRetry(url, options = {}) {
  const fallbackUrl = buildFallbackUrl(url);

  try {
    const response = await fetch(url, options);
    return { response, finalUrl: url, usedFallback: false };
  } catch (error) {
    const shouldRetry =
      fallbackUrl &&
      IPV6_LOCALHOST_CODES.has(error?.cause?.code) &&
      error?.cause?.address === '::1';

    if (shouldRetry) {
      console.warn('⚠️  Strapi no respondió en localhost (::1). Reintentando con 127.0.0.1...');
      const response = await fetch(fallbackUrl, options);
      return { response, finalUrl: fallbackUrl, usedFallback: true };
    }

    throw enhanceFetchError(error, url);
  }
}

function createStrapiRequestContext() {
  let baseUrl = DEFAULT_BASE_URL;

  async function request(pathOrUrl, options = {}) {
    const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
    const normalizedPath = isAbsolute ? pathOrUrl : `${baseUrl}${ensureLeadingSlash(pathOrUrl)}`;

    const { response, finalUrl, usedFallback } = await fetchWithAutoRetry(normalizedPath, options);
    const resolvedOrigin = new URL(finalUrl).origin.replace(/\/$/, '');

    if (resolvedOrigin !== baseUrl) {
      baseUrl = resolvedOrigin;
      if (usedFallback) {
        console.log(`ℹ️  Base URL ajustada automáticamente a ${baseUrl}`);
      }
    }

    return response;
  }

  function adminRequest(path, options = {}) {
    return request(`/admin${ensureLeadingSlash(path)}`, options);
  }

  function apiRequest(path, options = {}) {
    return request(`/api${ensureLeadingSlash(path)}`, options);
  }

  function getBaseUrl() {
    return baseUrl;
  }

  return { request, adminRequest, apiRequest, getBaseUrl };
}

module.exports = {
  DEFAULT_BASE_URL,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  createStrapiRequestContext
};
