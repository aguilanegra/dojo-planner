-- Waiver Template Table
CREATE TABLE IF NOT EXISTS "waiver_template" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"content" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"is_default" boolean DEFAULT false,
	"requires_guardian" boolean DEFAULT true,
	"guardian_age_threshold" integer DEFAULT 16,
	"sort_order" integer DEFAULT 0,
	"parent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "waiver_template_org_idx" ON "waiver_template" USING btree ("organization_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "waiver_template_org_slug_version_idx" ON "waiver_template" USING btree ("organization_id","slug","version");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "waiver_template_parent_idx" ON "waiver_template" USING btree ("parent_id");
--> statement-breakpoint
-- Signed Waiver Table
CREATE TABLE IF NOT EXISTS "signed_waiver" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"waiver_template_id" text NOT NULL,
	"waiver_template_version" integer NOT NULL,
	"member_id" text NOT NULL,
	"member_membership_id" text,
	"signature_data_url" text NOT NULL,
	"signed_by_name" text NOT NULL,
	"signed_by_email" text,
	"signed_by_relationship" text,
	"member_first_name" text NOT NULL,
	"member_last_name" text NOT NULL,
	"member_email" text NOT NULL,
	"member_date_of_birth" timestamp,
	"member_age_at_signing" integer,
	"rendered_content" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"signed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signed_waiver_org_idx" ON "signed_waiver" USING btree ("organization_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signed_waiver_member_idx" ON "signed_waiver" USING btree ("member_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signed_waiver_template_idx" ON "signed_waiver" USING btree ("waiver_template_id");
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD CONSTRAINT "signed_waiver_waiver_template_id_waiver_template_id_fk" FOREIGN KEY ("waiver_template_id") REFERENCES "public"."waiver_template"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD CONSTRAINT "signed_waiver_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD CONSTRAINT "signed_waiver_member_membership_id_member_membership_id_fk" FOREIGN KEY ("member_membership_id") REFERENCES "public"."member_membership"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
-- Membership-Waiver Junction Table
CREATE TABLE IF NOT EXISTS "membership_waiver" (
	"membership_plan_id" text NOT NULL,
	"waiver_template_id" text NOT NULL,
	"is_required" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "membership_waiver_membership_plan_id_waiver_template_id_pk" PRIMARY KEY("membership_plan_id","waiver_template_id")
);
--> statement-breakpoint
ALTER TABLE "membership_waiver" ADD CONSTRAINT "membership_waiver_membership_plan_id_membership_plan_id_fk" FOREIGN KEY ("membership_plan_id") REFERENCES "public"."membership_plan"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "membership_waiver" ADD CONSTRAINT "membership_waiver_waiver_template_id_waiver_template_id_fk" FOREIGN KEY ("waiver_template_id") REFERENCES "public"."waiver_template"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
-- Waiver Merge Field Table
CREATE TABLE IF NOT EXISTS "waiver_merge_field" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"default_value" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "waiver_merge_field_org_idx" ON "waiver_merge_field" USING btree ("organization_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "waiver_merge_field_org_key_idx" ON "waiver_merge_field" USING btree ("organization_id","key");
