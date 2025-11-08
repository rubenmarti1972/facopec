import type { Config } from '@strapi/types';

const serverConfig = ({ env }: Parameters<Config.Server>[0]) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS', ['a', 'b', 'c', 'd']),
  },
}) satisfies Config.Server;

export default serverConfig;
