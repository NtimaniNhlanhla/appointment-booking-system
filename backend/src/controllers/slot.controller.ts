import type { Request, Response, NextFunction } from 'express';
import { slotService } from '../services/slot.service.js';
import { sendSuccess } from '../utils/response.js';
import { getSlotsSchema } from '../validators/slot.validator.js';
import { sendError } from '../utils/response.js';

export const slotController = {
  getSlots: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = getSlotsSchema.safeParse(req.query);
      if (!result.success) {
        return sendError(res, 'Validation failed', 'VALIDATION_ERROR', 422);
      }
      const slots = await slotService.getSlots(result.data.branchId, result.data.date);
      sendSuccess(res, slots);
    } catch (err) {
      next(err);
    }
  },
};