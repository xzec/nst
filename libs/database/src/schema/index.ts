import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './users'
import * as ordersSchema from './orders'

export * from './users'
export * from './orders'

const fullSchema = { ...schema, ...ordersSchema }

export type Database = ReturnType<typeof createDb>

export function createDb(connectionString: string) {
  return drizzle(connectionString, { schema: fullSchema })
}
