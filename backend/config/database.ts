// backend/config/database.ts
import path from 'path';
import type { Config } from '@strapi/types/dist/core';
import type { ConfigParams } from './utils/env';

type DatabaseConfig = Config.Database<'sqlite'> | Config.Database<'postgres'>;

const databaseConfig = ({ env }: ConfigParams): DatabaseConfig => {
  const client = (process.env.DATABASE_CLIENT ?? '').toLowerCase();

  if (client !== 'postgres') {
    // ✅ Usar ruta absoluta al directorio raíz del proyecto backend
    // process.cwd() devuelve el directorio donde se ejecuta strapi (backend/)
    // Esto funciona tanto en desarrollo como después de compilar a dist/
    const dbPath = path.join(process.cwd(), 'data', 'strapi.db');
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: dbPath,
        },
        useNullAsDefault: true,
      },
    } satisfies Config.Database<'sqlite'>;
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
  } satisfies Config.Database<'postgres'>;
};

export default databaseConfig;
