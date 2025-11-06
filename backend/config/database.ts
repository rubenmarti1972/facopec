import type { Core } from '@strapi/types';
import path from 'path';

type ConfigParams = { env: typeof import('@strapi/utils').env };

const databaseConfig = ({ env }: ConfigParams) => {
  const client = env('DATABASE_CLIENT', 'sqlite') as 'sqlite' | 'postgres';

  if (client === 'sqlite') {
    const config = {
      connection: {
        client: 'sqlite', // 👈 NO 'better-sqlite3'
        connection: {
          filename: path.join(__dirname, '..', '.tmp', 'data.db'),
        },
        useNullAsDefault: true,
      },
    } satisfies Core.Config.Database<'sqlite'>;

    return config;
  }

  // PostgreSQL
  const config = {
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
  } satisfies Core.Config.Database<'postgres'>;

  return config;
};

export default databaseConfig;
