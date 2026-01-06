// backend/config/database.ts
import type { Config } from '@strapi/types/dist/core';
import type { ConfigParams } from './utils/env';

export default ({ env }: ConfigParams): Config.Database<'postgres'> => {
  const raw = env('DATABASE_URL');

  if (!raw) {
    throw new Error('Falta DATABASE_URL en el entorno');
  }

  const u = new URL(raw);

  const host = u.hostname;
  const port = u.port ? Number(u.port) : 5432;
  const database = u.pathname.replace(/^\//, '');
  const user = decodeURIComponent(u.username);
  const password = decodeURIComponent(u.password);

  return {
    connection: {
      client: 'postgres',
      connection: {
        host,
        port,
        database,
        user,
        password,
        schema: env('DATABASE_SCHEMA', 'public'),
        ssl: { rejectUnauthorized: false },
      },
    },
  };
};
