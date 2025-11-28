ALTER TABLE "member" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "member_type" text;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "subscription_plan" text;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN "flagged_for_deletion_at" timestamp;