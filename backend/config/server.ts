import type { Core } from '@strapi/types';

const serverConfig: Core.Config.ConfigExport<Core.Config.Server> = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['test-key-1', 'test-key-2', 'test-key-3', 'test-key-4'])
  },
  url: env('PUBLIC_URL'),
});

export default serverConfig;
