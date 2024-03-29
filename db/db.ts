import { createClient, LibsqlError } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { desc, eq, isNull } from 'drizzle-orm';
import users from './schemas/users';
import posts from './schemas/posts';
import StorageError from '@/types/StorageError';

const client = createClient({
  url: `file:${process.env.DB_URL}`,
});
const db = drizzle(client);

type NewUser = typeof users.$inferInsert;
export const insertUser = async (user: NewUser) => {
  try {
    return await db.insert(users).values(user);
  } catch (e) {
    if (e instanceof LibsqlError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new StorageError('Username already exists', e.code);
    }
    throw new StorageError('Failed to create user', 'UNKNOWN');
  }
};

type NewPost = typeof posts.$inferInsert;
export const insertPost = async (post: NewPost) => {
  return db.insert(posts).values(post);
};

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
    .innerJoin(users, eq(users.userId, posts.userId))
    .where(isNull(posts.replyTo))
    .orderBy(desc(posts.timestamp));
};

export const selectAllReplies = async (postId: string) => {
  return db
    .select({
      id: posts.postId,
      author: users.displayName,
      timestamp: posts.timestamp,
      content: posts.content,
    })
    .from(posts)
    .innerJoin(users, eq(users.userId, posts.userId))
    .where(eq(posts.replyTo, postId));
};
