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

  // >>>>>>>>>> UPLOAD CON CLOUDINARY <<<<<<<<<<
  upload: {
    enabled: true,
    config:
      env('UPLOAD_PROVIDER', 'cloudinary') === 'cloudinary'
        ? {
            // Usar Cloudinary
            provider: 'cloudinary',
            providerOptions: {
              cloud_name: env('CLOUDINARY_NAME'),
              api_key: env('CLOUDINARY_KEY'),
              api_secret: env('CLOUDINARY_SECRET'),
            },
            actionOptions: {
              upload: {},
              delete: {},
            },
          }
        : {
            // Fallback a local (por si algún día quieres usarlo en dev)
            provider: 'local',
            providerOptions: {
              sizeLimit: env.int('UPLOAD_MAX_SIZE', 52_428_800),
            },
          },
  },

  // Email plugin configuration with Brevo (formerly Sendinblue)
  email: {
    enabled: true,
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
        defaultFrom: env(
          'EMAIL_FROM',
          'profeencasasedeciudaddelsur@gmail.com',
        ),
        defaultReplyTo: env(
          'EMAIL_REPLY_TO',
          'profeencasasedeciudaddelsur@gmail.com',
        ),
      },
    },
  },
});

export default pluginsConfig;
