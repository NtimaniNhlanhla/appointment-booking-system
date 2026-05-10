import type { Request, Response, NextFunction } from 'express';

export function notFoundMiddleware(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    message: 'Not Found',
    error: {
      code: 'ROUTE_NOT_FOUND',
      detail: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
}