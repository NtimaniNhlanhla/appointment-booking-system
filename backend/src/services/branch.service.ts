import { branchRepository } from '../repositories/branch.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const branchService = {
  getAllBranches: async (search?: string, page = 1, limit = 9) => {
    return branchRepository.findAll(search, page, limit);
  },

  getBranchById: async (id: string) => {
    const branch = await branchRepository.findById(id);
    if (!branch) {
      throw new ApiError('BRANCH_NOT_FOUND', 404, 'Branch not found');
    }
    return branch;
  },
};