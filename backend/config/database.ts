import type { Config } from '@strapi/strapi';

const databaseConfig: Config['database'] = ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'sqlite'),
    connection: {
      connectionString: env('DATABASE_URL'),
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      schema: env('DATABASE_SCHEMA', 'public'),
      ssl: env.bool('DATABASE_SSL', false)
        ? {
            rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true)
          }
        : false,
      filename: env('DATABASE_FILENAME', '.tmp/data.db')
    },
    useNullAsDefault: true,
  },
});

export default databaseConfig;
