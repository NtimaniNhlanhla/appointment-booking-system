import { useQuery } from '@tanstack/react-query';
import { getBranches } from '../api/branchApi';

export function useBranches(search?: string) {
  return useQuery({
    queryKey: ['branches', search],
    queryFn: () => getBranches(search),
  });
}