import { integer, pgTable, text } from "drizzle-orm/pg-core";

const profile = pgTable("profile", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  readingGoal: integer("reading_goal"),
  booksRead: integer("books_read")
})

export default profile;