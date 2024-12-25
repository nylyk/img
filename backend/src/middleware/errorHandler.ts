import { ErrorRequestHandler } from 'express';
import HttpError from '../utils/httpError.js';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: 'Something went wrong' });
};

export default errorHandler;
