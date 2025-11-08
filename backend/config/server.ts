import type { ConfigParams } from './utils/env';

interface ServerConfig {
  host: string;
  port: number;
  url: string;
  app: {
    keys: string[];
  };
}

const serverConfig = ({ env }: ConfigParams): ServerConfig => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS', ['a', 'b', 'c', 'd']),
  },
});

export default serverConfig;
