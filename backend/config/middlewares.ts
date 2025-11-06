// backend/config/middlewares.ts
const middlewares = ({ env }: any) => {
  const isProd = env('NODE_ENV', 'development') === 'production';

  // Solo valores que realmente son orígenes (http/https)
  const rawOrigins = [
    'http://localhost:1337',
    'http://127.0.0.1:1337',
    'http://localhost:4200',   // Angular dev
    'http://127.0.0.1:4200',
    'http://localhost:5173',   // Vite
    env('APP_URL'),
    env('PUBLIC_URL'),
    env('FRONTEND_URL'),       // por si lo usas
  ];

  const allowedOrigins = rawOrigins
    .filter(Boolean)
    .filter((o) => typeof o === 'string' && /^https?:\/\//i.test(o));

  return [
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': [
              "'self'",
              'https:',
              ...allowedOrigins,
              'ws://localhost:1337',
              'ws://127.0.0.1:1337',
              'ws://localhost:4200',
              'ws://127.0.0.1:4200',
            ],
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: isProd ? allowedOrigins : ['*'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
        keepHeaderOnError: true,
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
};

export default middlewares;
