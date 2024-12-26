import { Api } from 'common';
import { Handler } from 'express';
import {
  defaultExpireTime,
  expireTimes,
  limitBytes,
  limitItems,
} from '../utils/env.js';

export const get: Handler = (_req, res, _next) => {
  const response: Api.Limits = {
    items: limitItems,
    bytes: limitBytes,
    expireTimes,
    defaultExpireTime,
  };

  res.json(response);
};
