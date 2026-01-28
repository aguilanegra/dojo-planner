CREATE TABLE "catalog_category" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"parent_id" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_item_category" (
	"catalog_item_id" text NOT NULL,
	"category_id" text NOT NULL,
	CONSTRAINT "catalog_item_category_catalog_item_id_category_id_pk" PRIMARY KEY("catalog_item_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "catalog_item_image" (
	"id" text PRIMARY KEY NOT NULL,
	"catalog_item_id" text NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" text,
	"is_primary" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_item" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"short_description" text,
	"sku" text,
	"base_price" real DEFAULT 0 NOT NULL,
	"compare_at_price" real,
	"event_id" text,
	"max_per_order" integer DEFAULT 10,
	"track_inventory" boolean DEFAULT true,
	"low_stock_threshold" integer DEFAULT 5,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"show_on_kiosk" boolean DEFAULT true,
	"size_type" text DEFAULT 'none',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalog_item_size" (
	"id" text PRIMARY KEY NOT NULL,
	"catalog_item_id" text NOT NULL,
	"size" text NOT NULL,
	"stock_quantity" integer DEFAULT 0,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "catalog_item_category" ADD CONSTRAINT "catalog_item_category_catalog_item_id_catalog_item_id_fk" FOREIGN KEY ("catalog_item_id") REFERENCES "public"."catalog_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_item_category" ADD CONSTRAINT "catalog_item_category_category_id_catalog_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."catalog_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_item_image" ADD CONSTRAINT "catalog_item_image_catalog_item_id_catalog_item_id_fk" FOREIGN KEY ("catalog_item_id") REFERENCES "public"."catalog_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_item" ADD CONSTRAINT "catalog_item_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_item_size" ADD CONSTRAINT "catalog_item_size_catalog_item_id_catalog_item_id_fk" FOREIGN KEY ("catalog_item_id") REFERENCES "public"."catalog_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "catalog_category_org_idx" ON "catalog_category" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_category_org_slug_idx" ON "catalog_category" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "catalog_image_item_idx" ON "catalog_item_image" USING btree ("catalog_item_id");--> statement-breakpoint
CREATE INDEX "catalog_item_org_idx" ON "catalog_item" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "catalog_item_type_idx" ON "catalog_item" USING btree ("organization_id","type");--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_item_org_slug_idx" ON "catalog_item" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "catalog_item_event_idx" ON "catalog_item" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "catalog_size_item_idx" ON "catalog_item_size" USING btree ("catalog_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "catalog_size_item_size_idx" ON "catalog_item_size" USING btree ("catalog_item_id","size");
