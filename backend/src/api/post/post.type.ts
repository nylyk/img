export interface Post {
  id: string;
  expiresAt: Date;
  secret: string;
}

export const postToFilename = (post: Post): string => {
  const expiresAtSeconds = Math.floor(post.expiresAt.getTime() / 1000);
  return `${post.id}.${post.secret}.${expiresAtSeconds}`;
};

export const filenameToPost = (filename: string): Post => {
  const parts = filename.split('.');
  if (parts.length !== 3) {
    throw new Error(`Filename ${filename} is not a valid post`);
  }

  const expiresAt = new Date(parseInt(parts[2]) * 1000);
  if (isNaN(expiresAt.getTime())) {
    throw new Error(`Filename ${filename} is not a valid post`);
  }

  return {
    id: parts[0],
    secret: parts[1],
    expiresAt,
  };
};
