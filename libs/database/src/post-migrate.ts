import dotenv from 'dotenv'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'

dotenv.config({ path: '../../.env', quiet: true })

const db = drizzle(process.env.DATABASE_URL!)

console.log('Running post-migrate script...')

await db.execute(
  sql`create unique index if not exists "order_stats_customer_id_unique_idx" on "order_stats" ("customer_id");`
)

console.log('post-migrate finished successfully.')
