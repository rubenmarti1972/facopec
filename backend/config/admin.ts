import type { ConfigParams } from './utils/env';

interface AdminConfig {
  auth: {
    secret: string;
  };
  apiToken: {
    salt: string;
  };
  transfer: {
    token: {
      salt: string;
    };
  };
  url: string;
  settings: {
    contentManager: {
      enablePermissions: boolean;
    };
  };
}

const adminConfig = ({ env }: ConfigParams): AdminConfig => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'replace-me'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'replace-me-api-token'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'replace-me-transfer-token'),
    },
  },
  url: env('ADMIN_URL', '/admin'),
  settings: {
    // 👇 HABILITA el menú Settings → Content Manager → Permissions
    contentManager: {
      enablePermissions: true,
    },
  },
}) satisfies Config.Admin;

export default adminConfig;
