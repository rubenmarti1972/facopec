import type { Core } from '@strapi/types';

import type { ConfigParams } from './utils/env';

type MiddlewaresConfig = Core.Config.Middlewares;

const middlewaresConfig = ({ env }: ConfigParams): MiddlewaresConfig => [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env
        .array('CORS_ORIGINS', ['http://localhost:4200', env('APP_URL')])
        .filter(Boolean),
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default middlewaresConfig;
