CREATE TYPE "public"."reading_status" AS ENUM('read', 'reading', 'want_to_read');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"authors" varchar(255),
	"isbn13" varchar NOT NULL,
	"coverImage" text,
	"publishedYear" integer,
	"description" text,
	"pageCount" integer,
	"categories" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "book_isbn13_unique" UNIQUE("isbn13")
);
--> statement-breakpoint
CREATE TABLE "bookclub" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"current_book_id" text
);
--> statement-breakpoint
CREATE TABLE "bookclub_book" (
	"bookclub_id" text NOT NULL,
	"book_id" text NOT NULL,
	CONSTRAINT "bookclub_book_bookclub_id_book_id_pk" PRIMARY KEY("bookclub_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "bookclub_user" (
	"bookclub_id" text NOT NULL,
	"user_id" text NOT NULL,
	"is_owner" boolean DEFAULT false NOT NULL,
	CONSTRAINT "bookclub_user_bookclub_id_user_id_pk" PRIMARY KEY("bookclub_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "discussion" (
	"id" text PRIMARY KEY NOT NULL,
	"library_id" text NOT NULL,
	"book_id" text NOT NULL,
	"title" text NOT NULL,
	"created_by_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussion_message" (
	"id" text PRIMARY KEY NOT NULL,
	"discussion_id" text NOT NULL,
	"user_id" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"bookclub_id" text
);
--> statement-breakpoint
CREATE TABLE "library_book" (
	"id" text PRIMARY KEY NOT NULL,
	"library_id" text NOT NULL,
	"book_id" text NOT NULL,
	"currentPage" integer,
	"readingStatus" "reading_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub" ADD CONSTRAINT "bookclub_current_book_id_book_id_fk" FOREIGN KEY ("current_book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub_book" ADD CONSTRAINT "bookclub_book_bookclub_id_bookclub_id_fk" FOREIGN KEY ("bookclub_id") REFERENCES "public"."bookclub"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub_book" ADD CONSTRAINT "bookclub_book_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub_user" ADD CONSTRAINT "bookclub_user_bookclub_id_bookclub_id_fk" FOREIGN KEY ("bookclub_id") REFERENCES "public"."bookclub"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub_user" ADD CONSTRAINT "bookclub_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_library_id_library_book_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."library_book"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_message" ADD CONSTRAINT "discussion_message_discussion_id_discussion_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussion"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_message" ADD CONSTRAINT "discussion_message_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library" ADD CONSTRAINT "library_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library" ADD CONSTRAINT "library_bookclub_id_bookclub_id_fk" FOREIGN KEY ("bookclub_id") REFERENCES "public"."bookclub"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_book" ADD CONSTRAINT "library_book_library_id_library_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_book" ADD CONSTRAINT "library_book_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;