export interface D1Prepared {
  bind(...values: unknown[]): D1Prepared;
  all<T>(): Promise<{ results: T[] }>;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}

export interface D1Database {
  prepare(query: string): D1Prepared;
  batch(statements: D1Prepared[]): Promise<unknown>;
}

export interface PagesEnv {
  DB?: D1Database;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAIL?: string;
}

export interface PagesContext {
  request: Request;
  env: PagesEnv;
  next: () => Promise<Response>;
}
