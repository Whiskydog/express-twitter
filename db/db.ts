import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';

const client = createClient({
  url: `file:${process.env.DB_URL}`,
});

const db = drizzle(client);
const users = sqliteTable('users', {
  userId: text('user_id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  displayName: text('display_name').notNull(),
});

const insertUserSchema = createInsertSchema(users);
export const requestInsertUserSchema = insertUserSchema.pick({
  username: true,
  password: true,
  displayName: true,
});

type InsertUser = typeof users.$inferInsert;
export const insertUser = async (user: InsertUser) => {
  return db.insert(users).values(user);
};
