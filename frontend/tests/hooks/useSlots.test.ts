import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSlots } from '@/features/bookings/hooks/useSlots';
import * as slotApi from '@/features/bookings/api/slotApi';
import { createWrapper } from '../utils/testWrapper';
import type { TimeSlot } from '@/features/bookings/types/booking.types';

vi.mock('@/features/bookings/api/slotApi');

const mockSlots: TimeSlot[] = [
  { id: 'slot-1', startTime: '09:00', endTime: '09:30', isBooked: false },
  { id: 'slot-2', startTime: '09:30', endTime: '10:00', isBooked: true },
  { id: 'slot-3', startTime: '10:00', endTime: '10:30', isBooked: false },
];

describe('useSlots', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches slots for a given branch and date', async () => {
    vi.mocked(slotApi.getSlots).mockResolvedValue(mockSlots);

    const { result } = renderHook(() => useSlots('branch-1', '2026-05-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(slotApi.getSlots).toHaveBeenCalledWith('branch-1', '2026-05-15');
    expect(result.current.data).toEqual(mockSlots);
  });

  it('does not fetch when branchId is empty', () => {
    const { result } = renderHook(() => useSlots('', '2026-05-15'), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(slotApi.getSlots).not.toHaveBeenCalled();
  });

  it('does not fetch when date is empty', () => {
    const { result } = renderHook(() => useSlots('branch-1', ''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(slotApi.getSlots).not.toHaveBeenCalled();
  });

  it('returns error state when API fails', async () => {
    vi.mocked(slotApi.getSlots).mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useSlots('branch-1', '2026-05-15'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
