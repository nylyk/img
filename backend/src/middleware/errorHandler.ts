import { ErrorRequestHandler } from 'express';
import HttpError from '../utils/httpError.js';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if (err.name && err.name === 'PayloadTooLargeError') {
    res.status(400).json({ error: 'Size exceeds maximum allowed size' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
};

export default errorHandler;
