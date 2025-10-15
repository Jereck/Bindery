import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const bookclub = pgTable('bookclub', {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 1000 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow()
})