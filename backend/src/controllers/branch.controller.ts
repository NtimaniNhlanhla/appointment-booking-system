import type { Request, Response, NextFunction } from 'express';
import { branchService } from '../services/branch.service.js';
import { sendSuccess } from '../utils/response.js';

export const branchController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 9, 50); // cap at 50
      const result = await branchService.getAllBranches(search, page, limit);
      res.status(200).json({
        message: 'Success',
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNextPage: result.page < result.totalPages,
        },
      });
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