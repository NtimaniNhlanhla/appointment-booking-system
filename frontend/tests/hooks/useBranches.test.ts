import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBranches } from '@/features/bookings/hooks/useBranches';
import * as branchApi from '@/features/bookings/api/branchApi';
import { createWrapper } from '../utils/testWrapper';
import type { Branch } from '@/features/bookings/types/booking.types';

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

describe('useBranches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns branches on successful fetch', async () => {
    vi.mocked(branchApi.getBranches).mockResolvedValue(mockBranches);

    const { result } = renderHook(() => useBranches(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockBranches);
    expect(branchApi.getBranches).toHaveBeenCalledWith(undefined);
  });

  it('passes search term to API', async () => {
    vi.mocked(branchApi.getBranches).mockResolvedValue([mockBranches[1]!]);

    const { result } = renderHook(() => useBranches('Cape Town'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(branchApi.getBranches).toHaveBeenCalledWith('Cape Town');
    expect(result.current.data).toHaveLength(1);
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
