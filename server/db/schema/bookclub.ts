import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import book from "./book";
import { relations } from "drizzle-orm";
import bookclubUser from "./bookclubUser";
import discussion from "./discussion";
import library from "./library";
import user from "./user";

const bookclub = pgTable("bookclub", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  currentBookId: text("current_book_id").references(() => book.id, { onDelete: 'cascade' }),
  ownerId: text("owner_id").notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const bookclubRelations = relations(bookclub, ({ many, one }) => ({
  members: many(bookclubUser),
  discussions: many(discussion),
  owner: one(user, {
    fields: [bookclub.ownerId],
    references: [user.id]
  })
}))

export default bookclub