type EnvFn = {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
  json<T = unknown>(key: string, defaultValue?: T): T;
  array(key: string, defaultValue?: string[]): string[];
};

interface ServerConfig {
  host: string;
  port: number;
  url: string;
  app: {
    keys: string[];
  };
}

const serverConfig = ({ env }: { env: EnvFn }): ServerConfig => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  app: {
    keys: env.array('APP_KEYS', ['a', 'b', 'c', 'd']),
  },
}) satisfies Config.Server;

export default serverConfig;
