export interface Post {
  id: string;
  expiresAt: number;
  secret: string;
}

export const postToFilename = (post: Post): string => {
  return `${post.id}.${post.secret}.${post.expiresAt}`;
};

export const filenameToPost = (filename: string): Post => {
  const parts = filename.split('.');
  if (parts.length !== 3) {
    throw new Error(`Filename ${filename} is not a valid post`);
  }

  return {
    id: parts[0],
    secret: parts[1],
    expiresAt: parseInt(parts[2]),
  };
};
