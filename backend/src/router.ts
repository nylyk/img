import express from 'express';
import post from './api/post/post.controller.js';
import footer from './api/footer.controller.js';
import { HttpError } from './utils/errors.js';

const router = express.Router();

router.get('/healthz', (_req, res) => {
  res.sendStatus(200);
});

router.use('/api/post', post);
router.use('/api/footer', footer);

router.use('/api/*', (_req, _res, next) =>
  next(new HttpError(404, 'Not Found'))
);

export default router;
