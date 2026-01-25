CREATE TABLE "attendance" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"member_id" text NOT NULL,
	"class_schedule_instance_id" text,
	"event_session_id" text,
	"attendance_date" timestamp NOT NULL,
	"check_in_time" timestamp DEFAULT now() NOT NULL,
	"check_out_time" timestamp,
	"check_in_method" text DEFAULT 'manual' NOT NULL,
	"checked_in_by_clerk_id" text,
	"instructor_clerk_id" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "audit_event" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"role" text,
	"status" text NOT NULL,
	"changes" text,
	"error" text,
	"ip_address" text,
	"user_agent" text,
	"request_id" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_enrollment" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"class_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"dropped_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "class_instructor" (
	"class_id" text NOT NULL,
	"instructor_clerk_id" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_instructor_class_id_instructor_clerk_id_pk" PRIMARY KEY("class_id","instructor_clerk_id")
);
--> statement-breakpoint
CREATE TABLE "class_schedule_exception" (
	"id" text PRIMARY KEY NOT NULL,
	"class_schedule_instance_id" text NOT NULL,
	"exception_date" timestamp NOT NULL,
	"exception_type" text NOT NULL,
	"new_start_time" text,
	"new_end_time" text,
	"new_instructor_clerk_id" text,
	"new_room" text,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_schedule_instance" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"primary_instructor_clerk_id" text,
	"day_of_week" integer NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"room" text,
	"effective_from" timestamp DEFAULT now() NOT NULL,
	"effective_until" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"program_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"color" text,
	"default_duration_minutes" integer DEFAULT 60,
	"max_capacity" integer,
	"min_age" integer,
	"max_age" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_tag" (
	"class_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "class_tag_class_id_tag_id_pk" PRIMARY KEY("class_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "coupon" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"discount_type" text NOT NULL,
	"discount_value" real NOT NULL,
	"applicable_to" text NOT NULL,
	"min_purchase_amount" real,
	"max_discount_amount" real,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0,
	"per_user_limit" integer DEFAULT 1,
	"valid_from" timestamp DEFAULT now() NOT NULL,
	"valid_until" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupon_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"coupon_id" text NOT NULL,
	"member_id" text NOT NULL,
	"transaction_id" text,
	"discount_applied" real NOT NULL,
	"used_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_billing" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"price" real NOT NULL,
	"member_only" boolean DEFAULT false,
	"valid_from" timestamp,
	"valid_until" timestamp,
	"max_registrations" integer,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_instructor" (
	"event_id" text NOT NULL,
	"instructor_clerk_id" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_instructor_event_id_instructor_clerk_id_pk" PRIMARY KEY("event_id","instructor_clerk_id")
);
--> statement-breakpoint
CREATE TABLE "event_registration" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"event_id" text NOT NULL,
	"event_billing_id" text,
	"status" text DEFAULT 'registered' NOT NULL,
	"amount_paid" real,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"cancelled_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"program_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"event_type" text NOT NULL,
	"image_url" text,
	"max_capacity" integer,
	"registration_deadline" timestamp,
	"is_public" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_session" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"primary_instructor_clerk_id" text,
	"session_date" timestamp NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"room" text,
	"max_capacity" integer,
	"is_cancelled" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_tag" (
	"event_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "event_tag_event_id_tag_id_pk" PRIMARY KEY("event_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "image" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"original_url" text NOT NULL,
	"thumbnail_sm_url" text,
	"thumbnail_md_url" text,
	"thumbnail_lg_url" text,
	"mime_type" text,
	"size_bytes" bigint,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "membership_plan" ADD COLUMN IF NOT EXISTS "program_id" text;
--> statement-breakpoint
CREATE TABLE "membership_tag" (
	"membership_plan_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "membership_tag_membership_plan_id_tag_id_pk" PRIMARY KEY("membership_plan_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "program" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"color" text,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"color" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"member_id" text NOT NULL,
	"member_membership_id" text,
	"event_registration_id" text,
	"stripe_payment_intent_id" text,
	"transaction_type" text NOT NULL,
	"amount" real NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"description" text,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE IF EXISTS "todo" CASCADE;--> statement-breakpoint
ALTER TABLE "member_membership" ADD COLUMN IF NOT EXISTS "billing_type" text DEFAULT 'autopay' NOT NULL;--> statement-breakpoint
ALTER TABLE "member_membership" ADD COLUMN IF NOT EXISTS "first_payment_date" timestamp;--> statement-breakpoint
ALTER TABLE "member_membership" ADD COLUMN IF NOT EXISTS "next_payment_date" timestamp;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN IF NOT EXISTS "clerk_user_id" text;--> statement-breakpoint
ALTER TABLE "member" ADD COLUMN IF NOT EXISTS "image_id" text;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_schedule_instance_id_class_schedule_instance_id_fk" FOREIGN KEY ("class_schedule_instance_id") REFERENCES "public"."class_schedule_instance"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_event_session_id_event_session_id_fk" FOREIGN KEY ("event_session_id") REFERENCES "public"."event_session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_enrollment" ADD CONSTRAINT "class_enrollment_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_enrollment" ADD CONSTRAINT "class_enrollment_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_instructor" ADD CONSTRAINT "class_instructor_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedule_exception" ADD CONSTRAINT "class_schedule_exception_class_schedule_instance_id_class_schedule_instance_id_fk" FOREIGN KEY ("class_schedule_instance_id") REFERENCES "public"."class_schedule_instance"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_schedule_instance" ADD CONSTRAINT "class_schedule_instance_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class" ADD CONSTRAINT "class_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_tag" ADD CONSTRAINT "class_tag_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_tag" ADD CONSTRAINT "class_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_coupon_id_coupon_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupon"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_usage" ADD CONSTRAINT "coupon_usage_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_billing" ADD CONSTRAINT "event_billing_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_instructor" ADD CONSTRAINT "event_instructor_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registration" ADD CONSTRAINT "event_registration_event_billing_id_event_billing_id_fk" FOREIGN KEY ("event_billing_id") REFERENCES "public"."event_billing"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_session" ADD CONSTRAINT "event_session_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tag" ADD CONSTRAINT "event_tag_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_tag" ADD CONSTRAINT "event_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_plan" ADD CONSTRAINT "membership_plan_program_id_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."program"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_tag" ADD CONSTRAINT "membership_tag_membership_plan_id_membership_plan_id_fk" FOREIGN KEY ("membership_plan_id") REFERENCES "public"."membership_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "membership_tag" ADD CONSTRAINT "membership_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_member_membership_id_member_membership_id_fk" FOREIGN KEY ("member_membership_id") REFERENCES "public"."member_membership"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_event_registration_id_event_registration_id_fk" FOREIGN KEY ("event_registration_id") REFERENCES "public"."event_registration"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attendance_org_idx" ON "attendance" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "attendance_member_idx" ON "attendance" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "attendance_date_idx" ON "attendance" USING btree ("attendance_date");--> statement-breakpoint
CREATE INDEX "attendance_schedule_idx" ON "attendance" USING btree ("class_schedule_instance_id");--> statement-breakpoint
CREATE INDEX "attendance_session_idx" ON "attendance" USING btree ("event_session_id");--> statement-breakpoint
CREATE INDEX "audit_org_idx" ON "audit_event" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_user_idx" ON "audit_event" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_event" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_timestamp_idx" ON "audit_event" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "class_enrollment_member_idx" ON "class_enrollment" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "class_enrollment_class_idx" ON "class_enrollment" USING btree ("class_id");--> statement-breakpoint
CREATE UNIQUE INDEX "class_enrollment_member_class_idx" ON "class_enrollment" USING btree ("member_id","class_id");--> statement-breakpoint
CREATE INDEX "class_exception_schedule_idx" ON "class_schedule_exception" USING btree ("class_schedule_instance_id");--> statement-breakpoint
CREATE INDEX "class_exception_date_idx" ON "class_schedule_exception" USING btree ("exception_date");--> statement-breakpoint
CREATE INDEX "class_schedule_class_idx" ON "class_schedule_instance" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "class_schedule_day_idx" ON "class_schedule_instance" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "class_org_idx" ON "class" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "class_program_idx" ON "class" USING btree ("program_id");--> statement-breakpoint
CREATE UNIQUE INDEX "class_org_slug_idx" ON "class" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "coupon_org_idx" ON "coupon" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_org_code_idx" ON "coupon" USING btree ("organization_id","code");--> statement-breakpoint
CREATE INDEX "coupon_status_idx" ON "coupon" USING btree ("status");--> statement-breakpoint
CREATE INDEX "coupon_usage_coupon_idx" ON "coupon_usage" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX "coupon_usage_member_idx" ON "coupon_usage" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "event_billing_event_idx" ON "event_billing" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_registration_member_idx" ON "event_registration" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "event_registration_event_idx" ON "event_registration" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_org_idx" ON "event" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "event_org_slug_idx" ON "event" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "event_session_event_idx" ON "event_session" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_session_date_idx" ON "event_session" USING btree ("session_date");--> statement-breakpoint
CREATE INDEX "image_entity_idx" ON "image" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "image_org_idx" ON "image" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "membership_plan_org_idx" ON "membership_plan" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "membership_plan_program_idx" ON "membership_plan" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "program_org_idx" ON "program" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "program_org_slug_idx" ON "program" USING btree ("organization_id","slug");--> statement-breakpoint
CREATE INDEX "tag_org_entity_idx" ON "tag" USING btree ("organization_id","entity_type");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_org_entity_slug_idx" ON "tag" USING btree ("organization_id","entity_type","slug");--> statement-breakpoint
CREATE INDEX "transaction_org_idx" ON "transaction" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "transaction_member_idx" ON "transaction" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "transaction_status_idx" ON "transaction" USING btree ("status");--> statement-breakpoint
CREATE INDEX "transaction_date_idx" ON "transaction" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "transaction_stripe_idx" ON "transaction" USING btree ("stripe_payment_intent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_membership_member_idx" ON "member_membership" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_membership_member_status_idx" ON "member_membership" USING btree ("member_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_org_idx" ON "member" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_org_status_idx" ON "member" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "member_org_email_idx" ON "member" USING btree ("organization_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "member_clerk_user_idx" ON "member" USING btree ("clerk_user_id");