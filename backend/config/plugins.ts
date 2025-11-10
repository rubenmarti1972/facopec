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
  // Email plugin disabled for now - enable when SMTP is configured
  // email: {
  //   enabled: true,
  //   config: {
  //     provider: 'sendmail',
  //     providerOptions: {},
  //     settings: {
  //       defaultFrom: env('EMAIL_DEFAULT_FROM', 'no-reply@facopec.org'),
  //       defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'contacto@facopec.org'),
  //     },
  //   },
  // },
});

export default pluginsConfig;
