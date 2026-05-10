import { apiClient } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';
import type { TimeSlot } from '../types/booking.types';

export async function getSlots(branchId: string, date: string): Promise<TimeSlot[]> {
  const { data } = await apiClient.get<{ data: TimeSlot[] }>(ENDPOINTS.SLOTS, {
    params: { branchId, date },
  });
  return data.data;
}