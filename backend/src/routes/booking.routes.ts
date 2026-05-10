import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { bookingController } from '../controllers/booking.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createBookingSchema } from '../validators/booking.validator.js';
import { asyncHandler } from '../middleware/asyncHandler.middleware.js';

const bookingLimiter = rateLimit({ windowMs: 60_000, max: 10 });

export const bookingRouter = Router();

bookingRouter.post('/', bookingLimiter, validate(createBookingSchema), asyncHandler(bookingController.create));
bookingRouter.get('/:bookingReference', asyncHandler(bookingController.getByReference));