import type { Core } from '@strapi/types';

const adminConfig: Core.Config.ConfigExport<Core.Config.Admin> = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'replace-me')
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'replace-me-api-token')
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'replace-me-transfer-token')
    }
  },
  watchIgnoreFiles: ['**/src/database/seed.ts'],
  url: env('ADMIN_URL'),
});

export default adminConfig;
