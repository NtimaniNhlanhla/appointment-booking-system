import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { sendError } from '../utils/response.js';

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, 'Validation failed', 'VALIDATION_ERROR', 422);
    }
    req.body = result.data;
    next();
  };
}