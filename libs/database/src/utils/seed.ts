import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { reset, seed } from 'drizzle-seed'
import * as schema from '~/schema'
import { orderStats } from '~/schema'

export interface SeedOptions {
  seed?: number
  usersCount?: number
  ordersCount?: number
  orderItemsCount?: number
}

export async function seedDatabase(connectionString: string, options: SeedOptions = {}) {
  const { seed: seedValue = Date.now(), usersCount = 20, ordersCount = 60, orderItemsCount = 120 } = options

  const db = drizzle(connectionString)

  try {
    await reset(db, schema)

    await seed(db, schema, { seed: seedValue }).refine((f) => ({
      users: {
        count: usersCount,
      },
      orders: {
        count: ordersCount,
      },
      orderItems: {
        count: orderItemsCount,
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

    await db.execute(sql`alter sequence users_id_seq restart with ${sql.raw(String(usersCount + 1))};
alter sequence orders_id_seq restart with ${sql.raw(String(ordersCount + 1))};
alter sequence order_items_id_seq restart with ${sql.raw(String(orderItemsCount + 1))};`)
  } finally {
    await db.$client.end()
  }
}
