import * as crypto from 'crypto';
import { createWriteStream, promises as fs } from 'fs';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';

import {
  expireTimesSeconds,
  idLength,
  maxSizeBytes,
  storagePath,
} from '@/utils/env.js';
import {
  PostExpireTimeError,
  PostInvalidSecretError,
  PostNotFoundError,
  PostSizeError,
} from '@/utils/errors.js';

import {
  idPattern,
  metaExtension,
  parsePostMeta,
  Post,
  serializePostMeta,
  tempExtension,
} from './post.type.js';

export const getPostFilePath = (post: Post): string => {
  return path.resolve(storagePath, post.id);
};

const getMetaFilePath = (id: string): string => {
  return path.resolve(storagePath, id + metaExtension);
};

const getTempFilePath = (id: string): string => {
  return path.resolve(storagePath, id + tempExtension);
};

const limitSize = (maxBytes: number): Transform => {
  let bytes = 0;
  return new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      bytes += chunk.byteLength;
      callback(bytes > maxBytes ? new PostSizeError() : null, chunk);
    },
  });
};

export const createPost = async (
  expiresInSeconds: number,
  data: Readable,
): Promise<Post> => {
  if (!expireTimesSeconds.includes(expiresInSeconds)) {
    throw new PostExpireTimeError();
  }

  const post: Post = {
    id: nanoid(idLength),
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    secret: crypto.randomBytes(16).toString('base64url'),
  };
  const tempFilePath = getTempFilePath(post.id);

  try {
    await pipeline(
      data,
      limitSize(maxSizeBytes),
      createWriteStream(tempFilePath),
    );
    await fs.writeFile(getMetaFilePath(post.id), serializePostMeta(post));
    await fs.rename(tempFilePath, getPostFilePath(post));
  } catch (err) {
    await Promise.all([
      fs.rm(tempFilePath, { force: true }),
      fs.rm(getMetaFilePath(post.id), { force: true }),
    ]);
    throw err;
  }

  return post;
};

export const getPost = async (id: string): Promise<Post> => {
  if (!idPattern.test(id)) {
    throw new PostNotFoundError();
  }

  let meta: string;
  try {
    meta = await fs.readFile(getMetaFilePath(id), 'utf8');
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      throw new PostNotFoundError();
    }
    throw err;
  }

  const post = parsePostMeta(id, meta);
  if (post.expiresAt.getTime() < Date.now()) {
    throw new PostNotFoundError();
  }
  return post;
};

export const deletePost = async (post: Post, secret: string): Promise<void> => {
  if (post.secret !== secret) {
    throw new PostInvalidSecretError();
  }

  await fs.rm(getMetaFilePath(post.id));
  await fs.rm(getPostFilePath(post), { force: true });
};
