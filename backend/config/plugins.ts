import type { Core } from '@strapi/types';

type ConfigParams = { env: typeof import('@strapi/utils').env };

const pluginsConfig = ({ env }: ConfigParams) => ({
  /* seo: {
    enabled: true
  }, */
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'es',
      locales: ['es', 'en']
    }
  },
  upload: {
    config: {
      provider: env('UPLOAD_PROVIDER', 'local'),
      providerOptions: {
        sizeLimit: env.int('UPLOAD_MAX_SIZE', 52428800)
      }
    }
  },
  email: {
    config: {
      provider: (() => {
        const provider = env('EMAIL_PROVIDER', 'smtp');
        if (provider.toLowerCase() === 'nodemailer') {
          return 'smtp';
        }
        return provider;
      })(),
      providerOptions: {
        host: env('EMAIL_SMTP_HOST'),
        port: env.int('EMAIL_SMTP_PORT', 465),
        secure: env.bool('EMAIL_SMTP_SECURE', true),
        auth: {
          user: env('EMAIL_SMTP_USERNAME'),
          pass: env('EMAIL_SMTP_PASSWORD')
        }
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM', 'no-reply@facopec.org'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO', 'contacto@facopec.org')
      }
    }
  }
}) satisfies Core.Config.Plugin;

export default pluginsConfig;
