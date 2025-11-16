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
  // Email plugin configuration
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // Gmail-specific settings
        secure: false, // true for 465, false for other ports
        requireTLS: true,
      },
      settings: {
        defaultFrom: env('SMTP_DEFAULT_FROM', 'notificaciones.facopec@gmail.com'),
        defaultReplyTo: env('SMTP_DEFAULT_REPLY_TO', 'profeencasasedeciudaddelsur@gmail.com'),
      },
    },
  },
});

export default pluginsConfig;
