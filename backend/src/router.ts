import express from 'express';
import HttpError from './utils/httpError.js';
import post from './api/post/post.controller.js';
import footer from './api/footer.controller.js';
import limits from './api/limits.controller.js';

const router = express.Router();

router.get('/healthz', (_req, res) => {
  res.sendStatus(200);
});

router.use('/api/post', post);
router.use('/api/footer', footer);
router.use('/api/limits', limits);

router.use('/api/*', (_req, _res, next) =>
  next(new HttpError(404, 'Not Found'))
);

export default router;
