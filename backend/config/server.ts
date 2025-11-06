import type { Config } from '@strapi/strapi';

const serverConfig: Config['server'] = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['test-key-1', 'test-key-2', 'test-key-3', 'test-key-4'])
  },
  url: env('PUBLIC_URL'),
});

export default serverConfig;
