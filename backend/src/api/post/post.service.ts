import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { nanoid } from 'nanoid';
import { Post, postToFilename } from './post.type.js';
import { expireTimes, limitBytes } from '../../utils/env.js';

export class PostExpireTimeError {}
export class PostSizeError {}

export const createPost = (expiresIn: number, data: string): Promise<Post> => {
  if (!expireTimes.includes(expiresIn)) {
    return Promise.reject(new PostExpireTimeError());
  }

  const buffer = Buffer.from(data, 'base64');
  if (buffer.byteLength > limitBytes) {
    return Promise.reject(new PostSizeError());
  }

  const post: Post = {
    id: nanoid(),
    expiresAt: Math.floor(Date.now() / 1000) + expiresIn,
    secret: crypto.randomBytes(16).toString('base64url'),
  };

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join('/data', postToFilename(post)), buffer, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(post);
    });
  });
};
