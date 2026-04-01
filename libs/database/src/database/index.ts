import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from 'src/schema'

export type Database = ReturnType<typeof createDb>

export function createDb(connectionString: string) {
  return drizzle(connectionString, { schema })
}
