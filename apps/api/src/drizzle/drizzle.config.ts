import * as schema from '@workspace/database'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool, type PoolConfig } from 'pg'

export type DrizzleDb = NodePgDatabase<typeof schema>

export const DRIZZLE_TOKEN = Symbol('DRIZZLE_TOKEN')

export function createDrizzleInstance(options: PoolConfig) {
  const pool = new Pool({
    connectionString: options.connectionString,
    max: options.max,
    min: options.min,
    idleTimeoutMillis: options.idleTimeoutMillis,
    connectionTimeoutMillis: options.connectionTimeoutMillis,
  })

  return drizzle({ client: pool, schema })
}
