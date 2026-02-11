-- Add membership plan snapshot columns to signed_waiver table
-- These capture membership details at the time of waiver signing for legal compliance
ALTER TABLE "signed_waiver" ADD COLUMN "membership_plan_name" text;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD COLUMN "membership_plan_price" real;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD COLUMN "membership_plan_frequency" text;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD COLUMN "membership_plan_contract_length" text;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD COLUMN "membership_plan_signup_fee" real;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD COLUMN "membership_plan_is_trial" boolean;
