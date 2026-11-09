export interface Post {
  id: string;
  expiresAt: Date;
  secret: string;
}

export const idPattern = /^[A-Za-z0-9_-]+$/;

export const metaExtension = '.json';
export const tempExtension = '.temp';

export const serializePostMeta = (post: Post): string => {
  return JSON.stringify({
    secret: post.secret,
    expiresAt: post.expiresAt.toISOString(),
  });
};

export const parsePostMeta = (id: string, json: string): Post => {
  const meta = JSON.parse(json);
  const expiresAt = new Date(meta?.expiresAt);
  if (typeof meta?.secret !== 'string' || isNaN(expiresAt.getTime())) {
    throw new Error(`Metadata of post ${id} is invalid`);
  }

  return { id, secret: meta.secret, expiresAt };
};
