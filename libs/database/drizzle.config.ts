import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './migrations',
  schema: './src/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
    database: process.env.DB_NAME,
  },
  migrations: {
    table: 'drizzle_migrations',
    schema: 'drizzle',
  },
})
