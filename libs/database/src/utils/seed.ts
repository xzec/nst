import { randomUUIDv7 } from 'node:crypto'
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

  // Pre-generate the ids so seeded rows stay time-ordered like app-generated ones.
  const userIds = Array.from({ length: usersCount }, () => randomUUIDv7())
  const orderIds = Array.from({ length: ordersCount }, () => randomUUIDv7())
  const orderItemIds = Array.from({ length: orderItemsCount }, () => randomUUIDv7())

  try {
    await reset(db, schema)

    await seed(db, schema, { seed: seedValue }).refine((f) => ({
      users: {
        count: usersCount,
        columns: {
          id: f.valuesFromArray({ values: userIds, isUnique: true }),
        },
      },
      orders: {
        count: ordersCount,
        columns: {
          id: f.valuesFromArray({ values: orderIds, isUnique: true }),
        },
      },
      orderItems: {
        count: orderItemsCount,
        columns: {
          id: f.valuesFromArray({ values: orderItemIds, isUnique: true }),
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
  } finally {
    await db.$client.end()
  }
}
