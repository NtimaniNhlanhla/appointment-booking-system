import { prisma } from '../config/database.js';

export const branchRepository = {
  findAll: (search?: string) =>
    prisma.branch.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { name: 'asc' },
    }),

  findById: (id: string) =>
    prisma.branch.findUnique({ where: { id } }),
};