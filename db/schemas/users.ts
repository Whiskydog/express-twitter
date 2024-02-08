import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const users = sqliteTable('users', {
  userId: text('user_id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  displayName: text('display_name').notNull(),
});

const insertSchema = createInsertSchema(users);
export const requestInsertSchema = insertSchema.pick({
  username: true,
  password: true,
  displayName: true,
});

const selectSchema = createSelectSchema(users);
export const requestSelectSchema = selectSchema.pick({
  username: true,
  password: true,
});

export type LoginUserSchema = z.infer<typeof requestSelectSchema>;

export type RegisterUserSchema = z.infer<typeof requestInsertSchema>;

export default users;
