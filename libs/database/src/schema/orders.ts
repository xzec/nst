import { integer, numeric, pgMaterializedView, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { countDistinct, desc, eq, max, sql } from 'drizzle-orm'
import { users } from '~/schema/users'

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
      customerId: sql`${users.id}`.as('customer_id'),
      name: users.name,
      totalOrders: countDistinct(orders.id).as('total_orders'),
      totalSpend: sql`sum(${orderItems.price} * ${orderItems.quantity})`.as('total_spend'),
      avgOrderValue: sql`avg(${orderItems.price} * ${orderItems.quantity})`.as('avg_order_value'),
      lastOrderAt: max(orders.createdAt).as('last_order_at'),
    })
    .from(users)
    .leftJoin(orders, eq(orders.customerId, users.id))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .groupBy(users.id, users.name)
    .orderBy((a) => desc(a.totalSpend).append(sql.raw(' nulls last')))
)
