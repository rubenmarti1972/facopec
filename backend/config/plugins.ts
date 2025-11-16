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
  // Email plugin configuration with Brevo (formerly Sendinblue)
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp-relay.brevo.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('BREVO_SMTP_USER'),
          pass: env('BREVO_SMTP_KEY'),
        },
        secure: false,
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'profeencasasedeciudaddelsur@gmail.com'),
        defaultReplyTo: env('EMAIL_REPLY_TO', 'profeencasasedeciudaddelsur@gmail.com'),
      },
    },
  },
});

export default pluginsConfig;
