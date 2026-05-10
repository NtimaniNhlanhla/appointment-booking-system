import type { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, message = 'Success', status = 200) {
  return res.status(status).json({ message, data });
}

export function sendError(res: Response, message: string, code: string, status: number) {
  return res.status(status).json({ message, code });
}