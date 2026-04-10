import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const USERS_EMAIL_UNIQUE_CONSTRAINT = 'users_email_unique' as const

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(USERS_EMAIL_UNIQUE_CONSTRAINT),
})
