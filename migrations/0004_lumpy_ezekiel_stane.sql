-- Create membership_plan table for storing available membership types
CREATE TABLE "membership_plan" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"program" text NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"signup_fee" real DEFAULT 0 NOT NULL,
	"frequency" text DEFAULT 'Monthly' NOT NULL,
	"contract_length" text NOT NULL,
	"access_level" text NOT NULL,
	"description" text,
	"is_trial" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
-- Create member_membership table for linking members to their membership plans
CREATE TABLE "member_membership" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"membership_plan_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "member_membership" ADD CONSTRAINT "member_membership_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "member_membership" ADD CONSTRAINT "member_membership_membership_plan_id_membership_plan_id_fk" FOREIGN KEY ("membership_plan_id") REFERENCES "public"."membership_plan"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
-- Remove subscription_plan column from member table
ALTER TABLE "member" DROP COLUMN IF EXISTS "subscription_plan";
