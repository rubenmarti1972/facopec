export interface Env {
  (key: string, defaultValue?: string): string;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
  array(key: string, defaultValue?: string[]): string[];
  json<T = unknown>(key: string, defaultValue?: T): T;
}

export type ConfigParams = { env: Env };
