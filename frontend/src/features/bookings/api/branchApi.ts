import { apiClient } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';
import type { Branch } from '../types/booking.types';

export interface BranchesPage {
  data: Branch[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export async function getBranches(search?: string, page = 1): Promise<BranchesPage> {
  const { data } = await apiClient.get<BranchesPage>(ENDPOINTS.BRANCHES, {
    params: { ...(search ? { search } : {}), page, limit: 9 },
  });
  return data;
}

export async function getBranch(id: string): Promise<Branch> {
  const { data } = await apiClient.get<{ data: Branch }>(ENDPOINTS.BRANCH(id));
  return data.data;
}