import { integer, numeric, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
})

export const orders = pgTable('orders', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  customerId: integer('customer_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const orderItems = pgTable('order_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id').references(() => orders.id),
  price: numeric('priceee', { precision: 10, scale: 2 }).notNull(),
  quantity: integer().notNull(),
})
