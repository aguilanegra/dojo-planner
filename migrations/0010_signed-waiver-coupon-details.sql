-- Add coupon/discount snapshot columns to signed_waiver table
-- These capture discount details at the time of waiver signing for legal compliance
ALTER TABLE "signed_waiver" ADD COLUMN "coupon_code" text;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD COLUMN "coupon_type" text;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD COLUMN "coupon_amount" text;
--> statement-breakpoint
ALTER TABLE "signed_waiver" ADD COLUMN "coupon_discounted_price" real;
