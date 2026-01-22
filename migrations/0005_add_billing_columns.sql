-- Add billing-related columns to member_membership table
ALTER TABLE "member_membership" ADD COLUMN "billing_type" text DEFAULT 'autopay' NOT NULL;
ALTER TABLE "member_membership" ADD COLUMN "first_payment_date" timestamp;
ALTER TABLE "member_membership" ADD COLUMN "next_payment_date" timestamp;
