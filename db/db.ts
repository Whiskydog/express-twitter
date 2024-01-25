import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
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
const posts = sqliteTable('posts', {
  postId: text('post_id').primaryKey(),
  content: text('content').notNull(),
  timestamp: integer('timestamp').notNull(),
  userId: text('user_id').notNull(),
  replyTo: text('reply_to'),
});

const insertUserSchema = createInsertSchema(users);
const insertPostSchema = createInsertSchema(posts);
export const requestInsertUserSchema = insertUserSchema.pick({
  username: true,
  password: true,
  displayName: true,
});
export const requestInsertPostSchema = insertPostSchema.pick({
  content: true,
});

type InsertUser = typeof users.$inferInsert;
export const insertUser = async (user: InsertUser) => {
  return db.insert(users).values(user);
};

type InsertPost = typeof posts.$inferInsert;
export const insertPost = async (post: InsertPost) => {
  return db.insert(posts).values(post);
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

export const selectPostById = async (postId: string) => {
  return db
    .select({
      id: posts.postId,
      author: users.displayName,
      timestamp: posts.timestamp,
      content: posts.content,
    })
    .from(posts)
    .innerJoin(users, eq(users.userId, posts.userId))
    .where(eq(posts.postId, postId));
};

export const selectAllPosts = async () => {
  return db
    .select({
      id: posts.postId,
      author: users.displayName,
      timestamp: posts.timestamp,
      content: posts.content,
    })
    .from(posts)
    .innerJoin(users, eq(users.userId, posts.userId));
};
