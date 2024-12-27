import express from 'express';
import HttpError from '../../utils/httpError.js';
import {
  createPost,
  getPost,
  PostExpireTimeError,
  PostNotFoundError,
  PostSizeError,
} from './post.service.js';
import { Api } from 'common';

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try {
    const [post, data] = await getPost(req.params.id);

    const response: Api.Post = {
      id: post.id,
      expiresAt: post.expiresAt,
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

router.put('/', async (req, res, next) => {
  if (!('expiresIn' in req.body && typeof req.body.expiresIn === 'number')) {
    return next(new HttpError(400, '"expiresIn" missing or not a number'));
  }
  if (!('data' in req.body && typeof req.body.data === 'string')) {
    return next(new HttpError(400, '"data" missing or not a string'));
  }

  try {
    const post = await createPost(req.body.expiresIn, req.body.data);

    const response: Api.PostUpload = {
      id: post.id,
      expiresAt: post.expiresAt,
      secret: post.secret,
    };
    res.json(response);
  } catch (err) {
    if (err instanceof PostExpireTimeError) {
      return next(
        new HttpError(400, '"expiresIn" is not one of the valid times')
      );
    } else if (err instanceof PostSizeError) {
      return next(new HttpError(400, 'Size exceeds maximum allowed size'));
    }
    console.error(err);
    next(new HttpError(500, 'Failed to create post'));
  }
});

export default router;
