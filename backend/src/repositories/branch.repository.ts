import { prisma } from '../config/database.js';

export interface BranchPage {
  data: Awaited<ReturnType<typeof prisma.branch.findMany>>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const branchRepository = {
  findAll: async (search?: string, page = 1, limit = 9): Promise<BranchPage> => {
    const where = {
      isActive: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { city: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.branch.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  findById: (id: string) =>
    prisma.branch.findUnique({ where: { id } }),
};