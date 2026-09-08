import { seedDatabase } from '~/utils/seed'

const connectionString = process.env.DATABASE_URL
const seed = process.env.DRIZZLE_SEED ? Number(process.env.DRIZZLE_SEED) : undefined

console.info('seed running...')

await seedDatabase(connectionString, { seed })

console.info('seed finished successfully.')
