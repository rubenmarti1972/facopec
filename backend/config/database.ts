// backend/config/database.ts
import type { Config } from '@strapi/types/dist/core';
import type { ConfigParams } from './utils/env';

export default ({ env }: ConfigParams): Config.Database<'postgres'> => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
    },
  },
});
