import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useBranches } from '@/features/bookings/hooks/useBranches';
import { PageContainer } from '@/components/layout/PageContainer';
import { BranchCard } from '@/components/booking/BranchCard';
import { BranchListItem } from '@/components/booking/BranchListItem';
import { BranchCardSkeleton } from '@/components/booking/BranchCardSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export function HomePage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { data: branches = [], isLoading, isError } = useBranches(debouncedSearch || undefined);

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
        <p className="text-sm text-gray-500 mt-1">Select a branch to get started</p>
      </div>

      <input
        type="text"
        placeholder="Search by branch or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        aria-label="Search branches"
      />

      {isLoading && (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <BranchCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorState message="Failed to load branches. Please refresh." />}

      {!isLoading && !isError && branches.length === 0 && (
        <EmptyState message="No branches found. Try a different search." />
      )}

      {!isLoading && !isError && branches.length > 0 && (
        <>
          {/* Mobile: list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {branches.map((branch) => (
              <BranchListItem key={branch.id} branch={branch} />
            ))}
          </div>
          {/* Tablet+: grid */}
          <div className="hidden sm:grid grid-cols-2 gap-4">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}