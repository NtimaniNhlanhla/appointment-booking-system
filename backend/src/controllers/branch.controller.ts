import type { Request, Response, NextFunction } from 'express';
import { branchService } from '../services/branch.service.js';
import { sendSuccess } from '../utils/response.js';

export const branchController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const branches = await branchService.getAllBranches(search);
      sendSuccess(res, branches);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branch = await branchService.getBranchById(req.params['id'] as string);
      sendSuccess(res, branch);
    } catch (err) {
      next(err);
    }
  },
};