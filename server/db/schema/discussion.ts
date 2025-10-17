import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import user from "./user";
import { relations } from "drizzle-orm";
import libraryBook from "./libraryBook";
import discussionMessage from "./discussionMessage";

const discussion = pgTable("discussion", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  libraryId: text("library_id").notNull().references(() => libraryBook.id),
  bookId: text("book_id").notNull(),
  title: text("title").notNull(),
  createdById: text("created_by_id").references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

export const discussionRelations = relations(discussion, ({ one, many }) => ({
  libraryBook: one(libraryBook, {
    fields: [discussion.libraryId, discussion.bookId],
    references: [libraryBook.libraryId, libraryBook.bookId]
  }),
  createdBy: one(user, {
    fields: [discussion.createdById],
    references: [user.id]
  }),
  messages: many(discussionMessage)
}))

export default discussion;