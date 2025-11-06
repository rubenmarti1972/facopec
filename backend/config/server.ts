// backend/config/server.ts
const serverConfig = ({ env }: any) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS', ['a', 'b', 'c', 'd']),
  },
});

export default serverConfig;
