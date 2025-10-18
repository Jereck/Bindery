import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import user from "./user";
import { relations } from "drizzle-orm";
import libraryBook from "./libraryBook";
import discussionMessage from "./discussionMessage";
import bookclub from "./bookclub";
import book from "./book";

const discussion = pgTable("discussion", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookclubId: text("bookclub_id").notNull().references(() => bookclub.id, { onDelete: 'cascade' }),
  bookId: text("book_id").notNull().references(() => book.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  createdById: text("created_by_id").references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export const discussionRelations = relations(discussion, ({ one, many }) => ({
  bookclub: one(bookclub, { fields: [discussion.bookclubId], references: [bookclub.id]}),
  book: one(book, { fields: [discussion.bookId], references: [book.id] }),
  createdBy: one(user, { fields: [discussion.createdById], references: [user.id] }),
  messages: many(discussionMessage)
}))

export default discussion;