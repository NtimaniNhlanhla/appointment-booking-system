import { Router } from 'express';
import { branchController } from '../controllers/branch.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.middleware.js';

export const branchRouter = Router();

branchRouter.get('/', asyncHandler(branchController.getAll));
branchRouter.get('/:id', asyncHandler(branchController.getById));