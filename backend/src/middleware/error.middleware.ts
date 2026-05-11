import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message, code: err.code });
  }

  logger.error(
    { err, method: req.method, path: req.path, ip: req.ip, query: req.query },
    'Unhandled error',
  );
  return res.status(500).json({ message: 'Internal server error', code: 'INTERNAL_ERROR' });
}