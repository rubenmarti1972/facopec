import type { Core } from '@strapi/types';

type ConfigParams = { env: typeof import('@strapi/utils').env };

const middlewaresConfig = ({ env }: ConfigParams) => ([
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
]) satisfies Core.Config.Middlewares;

export default middlewaresConfig;
