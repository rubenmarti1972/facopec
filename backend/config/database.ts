import path from 'path';
import type { Core } from '@strapi/types';

import type { ConfigParams } from './utils/env';

type DatabaseConfig = Core.Config.Database<'sqlite'> | Core.Config.Database<'postgres'>;

type Client = 'sqlite' | 'postgres';

const resolveClient = (): Client => {
  const configured = (process.env.DATABASE_CLIENT ?? '').toLowerCase() as Client | '';

  if (configured !== 'postgres') {
    return 'sqlite';
  }

  const hasExplicitConnection = Boolean(
    process.env.DATABASE_HOST && process.env.DATABASE_NAME && process.env.DATABASE_USERNAME,
  );

  if (hasExplicitConnection) {
    return 'postgres';
  }

  return 'sqlite';
};

const databaseConfig = ({ env }: ConfigParams): DatabaseConfig => {
  const client = resolveClient();

  if (client === 'sqlite') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(__dirname, '..', '.tmp', 'data.db'),
        },
        useNullAsDefault: true,
      },
    } satisfies DatabaseConfig;
  }

  const ssl = env.bool('DATABASE_SSL', false);
  const schema = env('DATABASE_SCHEMA', 'public');

  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        schema,
        ssl,
      },
    },
  } satisfies DatabaseConfig;
};

export default databaseConfig;
