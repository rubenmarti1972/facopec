import type { Config } from '@strapi/types';

const adminConfig = ({ env }: Parameters<Config.Admin>[0]) => ({
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

  // 👇 HABILITA el menú Settings → Content Manager → Permissions
  settings: {
    contentManager: {
      enablePermissions: true,
    },
  },
}) satisfies Config.Admin;

export default adminConfig;
