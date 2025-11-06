import type { Core } from '@strapi/types';

import type { ConfigParams } from './utils/env';

type AdminConfig = Core.Config.Admin & { watchIgnoreFiles?: string[] };

const adminConfig = ({ env }: ConfigParams): AdminConfig => ({
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
  watchIgnoreFiles: ['**/src/database/seed.ts'],
  url: env('ADMIN_URL'),
}) satisfies Core.Config.Admin;

export default adminConfig;
