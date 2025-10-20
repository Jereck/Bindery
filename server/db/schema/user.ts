import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import library from "./library";
import bookclubUser from "./bookclubUser";
import discussionMessage from "./discussionMessage";

const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ one, many }) => ({
  bookclubs: many(bookclubUser),
  messages: many(discussionMessage),
  library: one(library, {
    fields: [user.id],
    references: [library.ownerId]
  })
}))

export default user;