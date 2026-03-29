-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX "order_stats_customer_id_unique_idx" ON "order_stats" ("customer_id");