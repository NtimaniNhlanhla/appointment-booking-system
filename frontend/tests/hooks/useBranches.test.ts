import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBranches } from '@/features/bookings/hooks/useBranches';
import * as branchApi from '@/features/bookings/api/branchApi';
import { createWrapper } from '../utils/testWrapper';
import type { Branch } from '@/features/bookings/types/booking.types';
import type { BranchesPage } from '@/features/bookings/api/branchApi';

vi.mock('@/features/bookings/api/branchApi');

const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Sandton Branch',
    location: 'Sandton City Mall',
    address: 'Shop 123',
    city: 'Johannesburg',
    province: 'Gauteng',
    openingTime: '08:00',
    closingTime: '17:00',
  },
  {
    id: '2',
    name: 'Cape Town Branch',
    location: 'V&A Waterfront',
    address: 'Shop 45',
    city: 'Cape Town',
    province: 'Western Cape',
    openingTime: '08:00',
    closingTime: '17:00',
  },
];

const mockPage = (branches: Branch[], page = 1): BranchesPage => ({
  data: branches,
  pagination: { page, limit: 9, total: branches.length, totalPages: 1, hasNextPage: false },
});

describe('useBranches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns branches on successful fetch', async () => {
    vi.mocked(branchApi.getBranches).mockResolvedValue(mockPage(mockBranches));

    const { result } = renderHook(() => useBranches(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const branches = result.current.data?.pages.flatMap((p) => p.data);
    expect(branches).toEqual(mockBranches);
    expect(branchApi.getBranches).toHaveBeenCalledWith(undefined, 1);
  });

  it('passes search term to API', async () => {
    vi.mocked(branchApi.getBranches).mockResolvedValue(mockPage([mockBranches[1]!]));

    const { result } = renderHook(() => useBranches('Cape Town'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(branchApi.getBranches).toHaveBeenCalledWith('Cape Town', 1);
    const branches = result.current.data?.pages.flatMap((p) => p.data);
    expect(branches).toHaveLength(1);
  });

  it('returns error state when API fails', async () => {
    vi.mocked(branchApi.getBranches).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useBranches(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });

  it('starts in loading state', () => {
    vi.mocked(branchApi.getBranches).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useBranches(), { wrapper: createWrapper() });

    expect(result.current.isPending).toBe(true);
  });
});
