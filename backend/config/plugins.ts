import type { Core } from '@strapi/types';

import type { ConfigParams } from './utils/env';

type PluginsConfig = Core.Config.Plugin;

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
  email: {
    enabled: true,
    resolve: './providers/@strapi/provider-email-smtp',
    config: {
      provider: (() => {
        const provider = env('EMAIL_PROVIDER', 'smtp');
        return provider.toLowerCase() === 'nodemailer' ? 'smtp' : provider;
      })(),
      providerOptions: {
        host: env('EMAIL_SMTP_HOST'),
        port: env.int('EMAIL_SMTP_PORT', 465),
        secure: env.bool('EMAIL_SMTP_SECURE', true),
        auth: {
          user: env('EMAIL_SMTP_USERNAME'),
          pass: env('EMAIL_SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM', 'no-reply@facopec.org'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'contacto@facopec.org'),
      },
    },
  },
});

export default pluginsConfig;
