// backend/config/database.ts
import path from 'path';
import type { Core } from '@strapi/types';
import type { ConfigParams } from './utils/env';

type DatabaseConfig = Core.Config.Database<'sqlite'> | Core.Config.Database<'postgres'>;

const databaseConfig = ({ env }: ConfigParams): DatabaseConfig => {
  const client = (process.env.DATABASE_CLIENT ?? '').toLowerCase();

  if (client !== 'postgres') {
    // ✅ Apuntar SIEMPRE al root del proyecto, no a dist/
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: path.join(process.cwd(), '.tmp', 'data.db'),
        },
        useNullAsDefault: true,
      },
    } satisfies Core.Config.Database<'sqlite'>;
  }

  // ... tu config postgres aquí (igual a como la tienes)
  return {
    connection: {
      client: 'postgres',
      connection: {
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        schema: env('DATABASE_SCHEMA', 'public'),
        ssl: env.bool('DATABASE_SSL', false),
      },
    },
  } satisfies Core.Config.Database<'postgres'>;
};

export default databaseConfig;
