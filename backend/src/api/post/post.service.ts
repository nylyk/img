import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { nanoid } from 'nanoid';
import { filenameToPost, Post, postToFilename } from './post.type.js';
import { expireTimes, limitBytes } from '../../utils/env.js';

export class PostNotFoundError {}
export class PostExpireTimeError {}
export class PostSizeError {}
export class PostInvalidSecretError {}

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

export const getPost = (id: string): Promise<Post> => {
  return new Promise((resolve, reject) => {
    fs.readdir('/data', (err, files) => {
      if (err) {
        return reject(err);
      }

      const file = files.find((file) => file.substring(0, 21) === id);
      if (!file) {
        return reject(new PostNotFoundError());
      }

      const post = filenameToPost(file);
      if (post.expiresAt < Date.now() / 1000) {
        return reject(new PostNotFoundError());
      }

      resolve(post);
    });
  });
};

export const getPostData = (post: Post): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join('/data', postToFilename(post)), (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer.toString('base64'));
    });
  });
};

export const deletePost = (post: Post, secret: string): Promise<void> => {
  if (post.secret !== secret) {
    return Promise.reject(new PostInvalidSecretError());
  }

  return new Promise((resolve, reject) => {
    fs.rm(path.join('/data', postToFilename(post)), (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};
