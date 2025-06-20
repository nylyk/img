import { api } from 'common';
import express from 'express';

import {
  defaultExpireTimeSeconds,
  expireTimesSeconds,
  maxSizeBytes,
} from '@/utils/env.js';
import {
  HttpError,
  PostExpireTimeError,
  PostInvalidSecretError,
  PostNotFoundError,
  PostSizeError,
} from '@/utils/errors.js';

import {
  createPost,
  deletePost,
  getPost,
  getPostData,
} from './post.service.js';

const router = express.Router();

router.get('/metadata', (_req, res, _next) => {
  const response: api.PostMetadata = {
    maxSizeBytes,
    expireTimesSeconds,
    defaultExpireTimeSeconds,
  };
  res.json(response);
});

router.post('/', async (req, res, next) => {
  if (!req.body) {
    return next(new HttpError(400, 'Body missing'));
  }
  const expiresInSecondsValid =
    'expiresInSeconds' in req.body &&
    typeof req.body.expiresInSeconds === 'number';
  if (!expiresInSecondsValid) {
    return next(
      new HttpError(400, '"expiresInSeconds" missing or not a number'),
    );
  }
  if (!('data' in req.body && typeof req.body.data === 'string')) {
    return next(new HttpError(400, '"data" missing or not a string'));
  }

  try {
    const post = await createPost(req.body.expiresInSeconds, req.body.data);

    const response: api.CreatePost = {
      id: post.id,
      expiresAt: post.expiresAt.toISOString(),
      secret: post.secret,
    };
    res.json(response);
  } catch (err) {
    if (err instanceof PostExpireTimeError) {
      return next(
        new HttpError(400, '"expiresInSeconds" is not one of the valid times'),
      );
    } else if (err instanceof PostSizeError) {
      return next(new HttpError(400, 'Size exceeds maximum allowed size'));
    }
    console.error(err);
    next(new HttpError(500, 'Failed to create post'));
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await getPost(req.params.id);
    const data = await getPostData(post);

    const response: api.Post = {
      id: post.id,
      expiresAt: post.expiresAt.toISOString(),
      data,
    };
    res.json(response);
  } catch (err) {
    if (err instanceof PostNotFoundError) {
      return next(new HttpError(404, 'Post not found'));
    }
    console.error(err);
    next(new HttpError(500, 'Failed to get post'));
  }
});

router.delete('/:id', async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(
      new HttpError(401, 'Authorization header not set or wrong format'),
    );
  }

  const secret = authorization.slice(7);

  try {
    const post = await getPost(req.params.id);
    await deletePost(post, secret);
    res.json();
  } catch (err) {
    if (err instanceof PostNotFoundError) {
      return next(new HttpError(404, 'Post not found'));
    } else if (err instanceof PostInvalidSecretError) {
      return next(new HttpError(401, 'Invalid secret'));
    }
    console.error(err);
    next(new HttpError(500, 'Failed to delete post'));
  }
});

export default router;
