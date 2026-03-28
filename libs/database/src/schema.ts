import { integer, numeric, pgMaterializedView, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { countDistinct, eq, max, sql } from 'drizzle-orm'

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
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer().notNull(),
})

export const orderStats = pgMaterializedView('order_stats').as((qb) =>
  qb
    .select({
      customer_id: users.id,
      name: users.name,
      total_orders: countDistinct(orders.id).as('total_orders'),
      total_spend: sql`sum(${orderItems.price} * ${orderItems.quantity})`.as('total_spend'),
      avg_order_value: sql`avg(${orderItems.price}  * ${orderItems.quantity})`.as('avg_order_value'),
      last_order_at: max(orders.createdAt).as('last_order_at'),
    })
    .from(users)
    .leftJoin(orders, eq(orders.customerId, users.id))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .groupBy(users.id, users.name)
)
