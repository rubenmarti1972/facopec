const adminConfig = ({ env }: any) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'replace-me'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'replace-me-api-token'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'replace-me-transfer-token'),
    },
  },
  url: env('ADMIN_URL', '/admin'),
});

export default adminConfig;
