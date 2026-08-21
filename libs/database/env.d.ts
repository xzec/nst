export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_PASSWORD: string
      DATABASE_URL: string
      DRIZZLE_SEED: string
    }
  }
}
