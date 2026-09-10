import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import path from 'node:path'

export async function migrateDatabase(connectionString: string) {
  const db = drizzle(connectionString)
  try {
    await migrate(db, { migrationsFolder: path.join(__dirname, '../migrations') })
  } finally {
    await db.$client.end()
  }
}
