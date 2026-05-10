import { Skeleton } from '@/components/ui/Skeleton';

export function BranchCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <Skeleton className="w-full h-32" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-9 w-full mt-1 rounded" />
      </div>
    </div>
  );
}