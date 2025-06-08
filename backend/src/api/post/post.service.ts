import * as crypto from 'crypto';
import * as fs from 'fs';
import { nanoid } from 'nanoid';
import * as path from 'path';

import { expireTimesSeconds, idLength, maxSizeBytes } from '@/utils/env.js';
import {
  PostExpireTimeError,
  PostInvalidSecretError,
  PostNotFoundError,
  PostSizeError,
} from '@/utils/errors.js';

import { filenameToPost, Post, postToFilename } from './post.type.js';

export const createPost = (
  expiresInSeconds: number,
  data: string,
): Promise<Post> => {
  if (!expireTimesSeconds.includes(expiresInSeconds)) {
    return Promise.reject(new PostExpireTimeError());
  }

  const buffer = Buffer.from(data, 'base64url');
  if (buffer.byteLength > maxSizeBytes) {
    return Promise.reject(new PostSizeError());
  }

  const post: Post = {
    id: nanoid(idLength),
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
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

      const file = files.find(
        (file) => file.substring(0, file.indexOf('.')) === id,
      );
      if (!file) {
        return reject(new PostNotFoundError());
      }

      const post = filenameToPost(file);
      if (post.expiresAt.getTime() < Date.now()) {
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
      resolve(buffer.toString('base64url'));
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
