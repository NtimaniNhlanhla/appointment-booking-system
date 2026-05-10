import { useQuery } from '@tanstack/react-query';
import { getSlots } from '../api/slotApi';

export function useSlots(branchId: string, date: string) {
  return useQuery({
    queryKey: ['slots', branchId, date],
    queryFn: () => getSlots(branchId, date),
    enabled: !!branchId && !!date,
  });
}