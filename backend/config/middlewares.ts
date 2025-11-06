import type { Config } from '@strapi/strapi';

const middlewaresConfig: Config['middlewares'] = ({ env }) => ([
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', ['http://localhost:4200', env('APP_URL')]).filter(Boolean),
      credentials: true
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
]);

export default middlewaresConfig;
