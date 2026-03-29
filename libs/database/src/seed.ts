import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { seed, reset } from 'drizzle-seed'
import * as schema from '~/schema'

dotenv.config({ path: '../../.env' })

async function main() {
  const db = drizzle(process.env.DATABASE_URL!)

  await reset(db, schema)

  await seed(db, schema).refine((f) => ({
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
}

void main()
