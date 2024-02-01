import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import users from '@db/schemas/users';

const posts = sqliteTable('posts', {
  postId: text('post_id').primaryKey(),
  content: text('content').notNull(),
  timestamp: integer('timestamp').notNull(),
  userId: text('user_id')
    .references(() => users.userId)
    .notNull(),
  replyTo: text('reply_to'),
});

const insertSchema = createInsertSchema(posts);
export const requestInsertSchema = insertSchema.pick({
  content: true,
});

export default posts;
