import dotenv from 'dotenv'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

dotenv.config({ path: '../../.env', quiet: true })

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })

const db = drizzle(pool)

console.log('post-migrate running...')

await db.execute(
  sql`create unique index if not exists "order_stats_customer_id_unique_idx" on "order_stats" ("customer_id");`
)

console.log('post-migrate finished successfully.')

await pool.end()
