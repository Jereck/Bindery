CREATE TABLE "book" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"authors" varchar(255),
	"isbn13" varchar NOT NULL,
	"coverImage" text,
	"publishedYear" integer,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "book_isbn13_unique" UNIQUE("isbn13")
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
CREATE TABLE "library" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"bookclub_id" text
);
--> statement-breakpoint
CREATE TABLE "library_book" (
	"library_id" text NOT NULL,
	"book_id" text NOT NULL,
	CONSTRAINT "library_book_library_id_book_id_pk" PRIMARY KEY("library_id","book_id")
);
--> statement-breakpoint
ALTER TABLE "bookclub" RENAME COLUMN "title" TO "name";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bookclub" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookclub" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bookclub" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookclub" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bookclub" ADD COLUMN "current_book_id" text;--> statement-breakpoint
ALTER TABLE "bookclub_book" ADD CONSTRAINT "bookclub_book_bookclub_id_bookclub_id_fk" FOREIGN KEY ("bookclub_id") REFERENCES "public"."bookclub"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub_book" ADD CONSTRAINT "bookclub_book_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub_user" ADD CONSTRAINT "bookclub_user_bookclub_id_bookclub_id_fk" FOREIGN KEY ("bookclub_id") REFERENCES "public"."bookclub"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub_user" ADD CONSTRAINT "bookclub_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library" ADD CONSTRAINT "library_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library" ADD CONSTRAINT "library_bookclub_id_bookclub_id_fk" FOREIGN KEY ("bookclub_id") REFERENCES "public"."bookclub"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_book" ADD CONSTRAINT "library_book_library_id_library_id_fk" FOREIGN KEY ("library_id") REFERENCES "public"."library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_book" ADD CONSTRAINT "library_book_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub" ADD CONSTRAINT "bookclub_current_book_id_book_id_fk" FOREIGN KEY ("current_book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookclub" DROP COLUMN "createdAt";--> statement-breakpoint
ALTER TABLE "bookclub" DROP COLUMN "updatedAt";