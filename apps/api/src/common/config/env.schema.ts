import { z } from 'zod'
import { formatZodError } from '~/common/format-zod-error'

export type Env = z.infer<typeof envSchema>

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production'])
    .default('development')
    .describe('The environment the app is running in.'),
  PORT: z.coerce.number().default(3000).describe('The port to serve the API on.'),
  DATABASE_URL: z.url().describe('The URL of the database.'),
  DB_POOL_MAX: z.coerce
    .number()
    .min(0)
    .max(50)
    .default(20)
    .describe('Maximum number of clients the DB pool should contain.'),
  DB_POOL_MIN: z.coerce
    .number()
    .min(0)
    .max(50)
    .default(5)
    .describe('Minimum number of clients the pool should hold on to and not destroy with the idle timeout.'),
  DB_POOL_IDLE_TIMEOUT_MS: z.coerce
    .number()
    .min(1000)
    .default(30000)
    .describe(
      'Number of milliseconds a client must sit idle in the pool and not be checked out before it is disconnected from the backend and discarded.'
    ),
  DB_POOL_CONNECTION_TIMEOUT_MS: z.coerce
    .number()
    .min(1000)
    .default(10000)
    .describe('Number of milliseconds to wait before timing out when connecting a new client.'),
})

/**
 * Validate environment variables
 * @throws {Error} if environment variable validation fails
 */
export function validateEnv(env: unknown): Env {
  const { data, error } = envSchema.safeParse(env)

  if (error) {
    const validationError = formatZodError('Invalid environment variables:', error)

    throw new Error(validationError, { cause: error })
  }

  return data
}
