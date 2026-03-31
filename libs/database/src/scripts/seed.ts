import { drizzle } from 'drizzle-orm/node-postgres'
import { seed, reset } from 'drizzle-seed'
import * as schema from '~/schema'
import { Pool } from 'pg'
import { orderStats } from '~/schema'

console.info('seed running...')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const db = drizzle(pool)

await reset(db, schema)

await seed(db, schema, { seed: process.env.DRIZZLE_SEED ?? Date.now() }).refine((f) => ({
  users: {
    count: 20,
  },
  orders: {
    count: 60,
  },
  orderItems: {
    count: 120,
    columns: {
      quantity: f.int({
        minValue: 1,
        maxValue: 2,
      }),
      price: f.number({
        precision: 4,
        minValue: 10,
        maxValue: 1000,
      }),
    },
  },
}))

await db.refreshMaterializedView(orderStats).concurrently()

await pool.end()

console.info('seed finished successfully.')
