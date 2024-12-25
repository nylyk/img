import express from 'express';
import HttpError from './utils/httpError.js';

const router = express.Router();

router.use('/healthz', (_req, res) => {
  res.sendStatus(200);
});

router.use('/api/*', (_req, _res, next) =>
  next(new HttpError(404, 'Not Found'))
);

export default router;
