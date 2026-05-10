import { Router } from 'express';
import { branchRouter } from './branch.routes.js';
import { slotRouter } from './slot.routes.js';
// import { bookingRouter } from './booking.routes.js';
 import { healthRouter } from './health.routes.js';

export const router = Router();

router.use('/health', healthRouter);
router.use('/branches', branchRouter);
router.use('/slots', slotRouter);
// router.use('/bookings', bookingRouter);