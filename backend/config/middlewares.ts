// backend/config/middlewares.ts
const middlewares = ({ env }: any) => {
  const isProd = env('NODE_ENV', 'development') === 'production';

  // Lista de orígenes permitidos
  const rawOrigins = [
    // Localhost (Strapi)
    'http://localhost:1337',
    'http://127.0.0.1:1337',

    // Angular local
    'http://localhost:4200',
    'http://127.0.0.1:4200',

    // Vite u otros dev servers
    'http://localhost:5173',

    // Variables de entorno (por si algún día las usas)
    env('APP_URL'),
    env('PUBLIC_URL'),
    env('FRONTEND_URL'),

    // ⚡ DOMINIO REAL DEL FRONTEND EN FIREBASE
    'https://fundacion-afrocolombiana.web.app',

    // ⚡ URL DEL PROPIO SERVIDOR EN RENDER (necesario para algunos plugins)
    'https://facopec-strapi.onrender.com',
  ];

  // Limpia y filtra valores válidos
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

              // WebSockets locales
              'ws://localhost:1337',
              'ws://127.0.0.1:1337',
              'ws://localhost:4200',
              'ws://127.0.0.1:4200',
            ],
          },
        },
      },
    },

    // 🔥 Aquí se aplica realmente CORS
    {
      name: 'strapi::cors',
      config: {
        origin: isProd ? allowedOrigins : ['*'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        headers: [
          'Content-Type',
          'Authorization',
          'Origin',
          'Accept',
          'X-Requested-With'
        ],
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
