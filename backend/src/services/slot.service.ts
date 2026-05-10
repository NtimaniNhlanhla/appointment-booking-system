import { slotRepository } from '../repositories/slot.repository.js';
import { branchRepository } from '../repositories/branch.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const slotService = {
  getSlots: async (branchId: string, dateStr: string) => {
    const branch = await branchRepository.findById(branchId);
    if (!branch) throw new ApiError('BRANCH_NOT_FOUND', 404, 'Branch not found');

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) throw new ApiError('INVALID_DATE', 400, 'Invalid date format');

    return slotRepository.findByBranchAndDate(branchId, date);
  },
};