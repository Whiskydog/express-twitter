import {
  insertPost,
  requestInsertPostSchema,
  selectAllPosts,
  selectAllReplies,
  selectPostById,
} from '../db/db';
import Post from '../models/Post';
import { nanoid } from 'nanoid';

const getAll = async (): Promise<Post[]> => {
  const posts = await selectAllPosts();
  return posts.map((post) => new Post(post));
};

const getById = async (id: string): Promise<Post> => {
  const post = (await selectPostById(id))[0];
  return new Post(post);
};

const getRepliesTo = async (id: string): Promise<Post[]> => {
  const replies = await selectAllReplies(id);
  return replies.map((reply) => new Post(reply));
};

const createNewPost = async (
  content: string,
  userId: string
): Promise<string> => {
  requestInsertPostSchema.parse(content);
  const postId = nanoid();
  const newPost = {
    postId,
    content,
    timestamp: Date.now(),
    userId,
  };
  await insertPost(newPost);
  return postId;
};

export default {
  getAll,
  getById,
  getRepliesTo,
  createNewPost,
};
