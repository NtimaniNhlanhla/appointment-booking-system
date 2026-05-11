import { useInfiniteQuery } from '@tanstack/react-query';
import { getBranches } from '../api/branchApi';

export function useBranches(search?: string) {
  return useInfiniteQuery({
    queryKey: ['branches', search],
    queryFn: ({ pageParam = 1 }) => getBranches(search, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });
}