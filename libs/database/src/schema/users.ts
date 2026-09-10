import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const USERS_EMAIL_UNIQUE_CONSTRAINT = 'users_email_unique' as const

export const users = pgTable('users', {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(USERS_EMAIL_UNIQUE_CONSTRAINT),
})
