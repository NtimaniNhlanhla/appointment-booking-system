import { prisma } from '../config/database.js';

export const slotRepository = {
  findByBranchAndDate: (branchId: string, date: Date) =>
    prisma.timeSlot.findMany({
      where: { branchId, slotDate: date },
      orderBy: { startTime: 'asc' },
    }),

  findById: (id: string) =>
    prisma.timeSlot.findUnique({ where: { id } }),
};