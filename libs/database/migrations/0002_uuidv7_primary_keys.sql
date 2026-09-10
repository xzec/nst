-- Integer identity primary keys become uuid v7 (native uuidv7() in postgres 18).
-- There is no cast from integer to uuid and "order_stats" depends on both "users"."id"
-- and "orders"."customer_id", so no ALTERs, just drop and recreate.
-- Existing rows are discarded.
DROP MATERIALIZED VIEW "public"."order_stats";--> statement-breakpoint
DROP TABLE "order_items" CASCADE;--> statement-breakpoint
DROP TABLE "orders" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"order_id" uuid,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"customer_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE MATERIALIZED VIEW "public"."order_stats" AS (select "users"."id" as "customer_id", "users"."name", count(distinct "orders"."id") as "total_orders", sum("order_items"."price" * "order_items"."quantity") as "total_spend", avg("order_items"."price" * "order_items"."quantity") as "avg_order_value", max("orders"."created_at") as "last_order_at" from "users" left join "orders" on "orders"."customer_id" = "users"."id" left join "order_items" on "order_items"."order_id" = "orders"."id" group by "users"."id", "users"."name" order by "total_spend" desc nulls last);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "order_stats_customer_id_unique_idx" ON "order_stats" ("customer_id");
