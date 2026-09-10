export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PASSWORD: string
      DB_NAME: string
      DB_PORT: string
      DATABASE_URL: string
      DRIZZLE_SEED: string
    }
  }
}
