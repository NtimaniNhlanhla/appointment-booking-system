import { apiClient } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';
import type { Branch } from '../types/booking.types';

export async function getBranches(search?: string): Promise<Branch[]> {
  const params = search ? { search } : undefined;
  const { data } = await apiClient.get<{ data: Branch[] }>(ENDPOINTS.BRANCHES, { params });
  return data.data;
}

export async function getBranch(id: string): Promise<Branch> {
  const { data } = await apiClient.get<{ data: Branch }>(ENDPOINTS.BRANCH(id));
  return data.data;
}