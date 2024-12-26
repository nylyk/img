import express from 'express';
import HttpError from './utils/httpError.js';
import * as footer from './api/footer.controller.js';
import * as limits from './api/limits.controller.js';

const router = express.Router();

router.get('/healthz', (_req, res) => {
  res.sendStatus(200);
});

router.get('/api/footer', footer.get);
router.get('/api/limits', limits.get);

router.use('/api/*', (_req, _res, next) =>
  next(new HttpError(404, 'Not Found'))
);

export default router;
