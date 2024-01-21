import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { eq } from 'drizzle-orm';

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

const selectUserSchema = createSelectSchema(users);
export const requestSelectUserSchema = selectUserSchema.pick({
  username: true,
  password: true,
});

export const selectUserById = async (userId: string) => {
  return db.select().from(users).where(eq(users.userId, userId));
};

export const selectUserByUsername = async (username: string) => {
  return db.select().from(users).where(eq(users.username, username));
};
