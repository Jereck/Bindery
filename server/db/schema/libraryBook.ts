import { integer, pgEnum, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import library from "./library";
import book from "./book";
import { relations } from "drizzle-orm";

export const readingStatusEnum = pgEnum('reading_status', ['read', 'reading', 'want_to_read']);

export const libraryBook = pgTable('library_book', 
  {
    libraryId: text('library_id').notNull().references(() => library.id, { onDelete: 'cascade' }),
    bookId: text("book_id").notNull().references(() => book.id, { onDelete: 'cascade' }),
    currentPage: integer(),
    readingStatus: readingStatusEnum().notNull()
  },
  (t) => ({
    pk: primaryKey({ columns: [t.libraryId, t.bookId ]})
  })
)

export const libraryBookRelations = relations(libraryBook, ({ one }) => ({
  library: one(library, { fields: [libraryBook.libraryId], references: [library.id] }),
  book: one(book, { fields: [libraryBook.bookId], references: [book.id] })
}));

export default libraryBook;