import type { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service.js';
import { sendSuccess } from '../utils/response.js';

export const bookingController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await bookingService.create(req.body);
      sendSuccess(res, booking, 'Booking confirmed', 201);
    } catch (err) {
      next(err);
    }
  },

  getByReference: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const booking = await bookingService.getByReference(req.params['bookingReference'] as string);
      sendSuccess(res, booking);
    } catch (err) {
      next(err);
    }
  },
};