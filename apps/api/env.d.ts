export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_PASSWORD: string
      DATABASE_URL: string
    }
  }
}
