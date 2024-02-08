import {
  insertPost,
  selectAllPosts,
  selectAllReplies,
  selectPostById,
} from '@db/db';
import Post from '@/models/Post';
import { nanoid } from 'nanoid';
import { NewPostSchema } from '@db/schemas/posts';

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

const createNewPost = async (newPost: NewPostSchema): Promise<string> => {
  const postId = nanoid();
  await insertPost({ postId, ...newPost, timestamp: Date.now() });
  return postId;
};

export default {
  getAll,
  getById,
  getRepliesTo,
  createNewPost,
};
