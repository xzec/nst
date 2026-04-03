import { drizzle } from 'drizzle-orm/node-postgres'
import { seed, reset } from 'drizzle-seed'
import * as schema from '~/schema'
import { Pool } from 'pg'
import { orderStats } from '~/schema'
import { sql } from 'drizzle-orm'

const USERS_COUNT = 20
const ORDERS_COUNT = 60
const ORDER_ITEMS_COUNT = 120

console.info('seed running...')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const db = drizzle(pool)

await reset(db, schema)

await seed(db, schema, { seed: process.env.DRIZZLE_SEED ? Number(process.env.DRIZZLE_SEED) : Date.now() }).refine(
  (f) => ({
    users: {
      count: USERS_COUNT,
    },
    orders: {
      count: ORDERS_COUNT,
    },
    orderItems: {
      count: ORDER_ITEMS_COUNT,
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
  })
)

await db.refreshMaterializedView(orderStats).concurrently()

await db.execute(sql`alter sequence users_id_seq restart with ${sql.raw(String(USERS_COUNT + 1))};
alter sequence orders_id_seq restart with ${sql.raw(String(ORDERS_COUNT + 1))};
alter sequence order_items_id_seq restart with ${sql.raw(String(ORDER_ITEMS_COUNT + 1))};`)

await pool.end()

console.info('seed finished successfully.')
