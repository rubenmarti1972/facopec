type EnvFn = <T = string>(key: string, defaultValue?: T) => T;

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

const adminConfig = ({ env }: { env: EnvFn }): AdminConfig => ({
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

  // 👇 HABILITA el menú Settings → Content Manager → Permissions
  settings: {
    contentManager: {
      enablePermissions: true,
    },
  },
});

export default adminConfig;
