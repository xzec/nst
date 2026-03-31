import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

console.info('post-migrate running...')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const db = drizzle(pool)

await db.execute(
  sql`create unique index if not exists "order_stats_customer_id_unique_idx" on "order_stats" ("customer_id");`
)

await pool.end()

console.info('post-migrate finished successfully.')
