import type { Config } from '@strapi/strapi';

const adminConfig: Config['admin'] = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'replace-me')
  },
  watchIgnoreFiles: ['**/src/database/seed.ts'],
  url: env('ADMIN_URL'),
});

export default adminConfig;
