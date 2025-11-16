import type { Config } from '@strapi/types/dist/core';

import type { ConfigParams } from './utils/env';

type PluginsConfig = Config.Plugin;

const pluginsConfig = ({ env }: ConfigParams): PluginsConfig => ({
  /* seo: {
    enabled: true,
  }, */
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'es',
      locales: ['es', 'en'],
    },
  },
  upload: {
    enabled: true,
    config: {
      provider: env('UPLOAD_PROVIDER', 'local'),
      providerOptions: {
        sizeLimit: env.int('UPLOAD_MAX_SIZE', 52_428_800),
      },
    },
  },
  // Email plugin configuration with SendGrid
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'contacto@facopec.org'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'profeencasasedeciudaddelsur@gmail.com'),
      },
    },
  },
});

export default pluginsConfig;
