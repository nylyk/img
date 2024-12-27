import express from 'express';
import { Api } from 'common';
import { defaultExpireTime, expireTimes, limitBytes } from '../utils/env.js';

const router = express.Router();

router.get('/', (_req, res, _next) => {
  const response: Api.Limits = {
    sizeBytes: limitBytes,
    expireTimes,
    defaultExpireTime,
  };

  res.json(response);
});

export default router;
