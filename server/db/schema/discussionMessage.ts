import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import user from "./user";
import discussion from "./discussion";

const discussionMessage = pgTable("discussion_message", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  discussionId: text("discussion_id").notNull().references(() => discussion.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const discussionMessageRelations = relations(discussionMessage, ({ one }) => ({
  discussion: one(discussion, { fields: [discussionMessage.discussionId], references: [discussion.id] }),
  user: one(user, { fields: [discussionMessage.userId], references: [user.id] })
}));

export default discussionMessage;