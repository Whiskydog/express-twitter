import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import users from '@db/schemas/users';
import { z } from 'zod';

const posts = sqliteTable('posts', {
  postId: text('post_id').primaryKey(),
  content: text('content').notNull(),
  timestamp: integer('timestamp').notNull(),
  userId: text('user_id')
    .references(() => users.userId)
    .notNull(),
  replyTo: text('reply_to'),
});

const insertSchema = createInsertSchema(posts, {
  postId: z.string(),
  content: z
    .string()
    .min(1, 'Post must contain at least 1 character')
    .max(256, 'Post must contain at most 256 characters')
    .trim(),
  timestamp: z.number().int(),
  userId: z.string(),
  replyTo: z.string().optional(),
});

export const requestInsertSchema = insertSchema.pick({
  content: true,
  userId: true,
  replyTo: true,
});

export const formInsertSchema = insertSchema.pick({
  content: true,
});

export type NewPostSchema = z.infer<typeof requestInsertSchema>;

export default posts;
