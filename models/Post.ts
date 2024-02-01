import { formatDistanceToNowStrict } from 'date-fns';

class Post {
  id: string;
  content: string;
  timestamp: number;
  author: string;

  constructor({
    id,
    content,
    timestamp,
    author,
  }: {
    id: string;
    content: string;
    timestamp: number;
    author: string;
  }) {
    this.id = id;
    this.content = content;
    this.timestamp = timestamp;
    this.author = author;
  }

  get postedOn() {
    return formatDistanceToNowStrict(new Date(this.timestamp), {
      addSuffix: true,
    });
  }
}

export default Post;
