import { relations } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { libraryBook } from "./libraryBook";

const library = pgTable("library", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  ownerType: varchar("owner_type", { length: 20 }).notNull(),
  ownerId: text("owner_id").notNull(),
})

export const libraryRelations = relations(library, ({ one, many }) => ({
  books: many(libraryBook),
}))

export default library;