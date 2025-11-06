import path from 'path';
import type { Core } from '@strapi/types';

import type { ConfigParams } from './utils/env';

type DatabaseConfig = Core.Config.Database<'sqlite'> | Core.Config.Database<'postgres'>;

type Client = 'sqlite' | 'postgres';

const databaseConfig = ({ env }: ConfigParams): DatabaseConfig => {
  const client = env('DATABASE_CLIENT', 'sqlite') as Client;

  if (client === 'sqlite') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', '.tmp', 'data.db'),
        },
        useNullAsDefault: true,
      },
    } as DatabaseConfig;
  }

  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false),
        schema: env('DATABASE_SCHEMA', 'public'),
      },
    },
  } as DatabaseConfig;
};

export default databaseConfig;
