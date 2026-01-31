-- Migration: Replace catalog_item_size with catalog_item_variant
-- This migration removes the size-based inventory system and replaces it with
-- user-defined variants that have name, price, and stock quantity.

-- Drop old size table and its constraints
DROP INDEX IF EXISTS "catalog_size_item_idx";
--> statement-breakpoint
DROP INDEX IF EXISTS "catalog_size_item_size_idx";
--> statement-breakpoint
DROP TABLE IF EXISTS "catalog_item_size";
--> statement-breakpoint
-- Remove sizeType column from catalog_item (no longer needed)
ALTER TABLE "catalog_item" DROP COLUMN IF EXISTS "size_type";
--> statement-breakpoint
-- Create new variant table
CREATE TABLE "catalog_item_variant" (
	"id" text PRIMARY KEY NOT NULL,
	"catalog_item_id" text NOT NULL,
	"name" text NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"stock_quantity" integer DEFAULT 0,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog_item_variant" ADD CONSTRAINT "catalog_item_variant_catalog_item_id_catalog_item_id_fk" FOREIGN KEY ("catalog_item_id") REFERENCES "public"."catalog_item"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "catalog_variant_item_idx" ON "catalog_item_variant" USING btree ("catalog_item_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_variant_item_name_idx" ON "catalog_item_variant" USING btree ("catalog_item_id","name");
