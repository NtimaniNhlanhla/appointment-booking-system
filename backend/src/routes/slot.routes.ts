import { Router } from 'express';
import { slotController } from '../controllers/slot.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.middleware.js';

export const slotRouter = Router();

slotRouter.get('/', asyncHandler(slotController.getSlots));