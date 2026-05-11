import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBooking } from '@/features/bookings/hooks/useBooking';
import * as bookingApi from '@/features/bookings/api/bookingApi';
import { createWrapper } from '../utils/testWrapper';
import type { Booking } from '@/features/bookings/types/booking.types';

vi.mock('@/features/bookings/api/bookingApi');

const mockBooking: Booking = {
  id: 'booking-1',
  bookingReference: 'BK-20260511-A1B2',
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  customerPhone: '0821234567',
  status: 'CONFIRMED',
  slot: { startTime: '09:00', endTime: '09:30', slotDate: '2026-05-15' },
  branch: {
    name: 'Sandton Branch',
    address: 'Shop 123',
    city: 'Johannesburg',
    province: 'Gauteng',
  },
  createdAt: '2026-05-11T10:00:00Z',
};

describe('useBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches booking by reference', async () => {
    vi.mocked(bookingApi.getBooking).mockResolvedValue(mockBooking);

    const { result } = renderHook(() => useBooking('BK-20260511-A1B2'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(bookingApi.getBooking).toHaveBeenCalledWith('BK-20260511-A1B2');
    expect(result.current.data).toEqual(mockBooking);
  });

  it('does not fetch when reference is empty', () => {
    const { result } = renderHook(() => useBooking(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
    expect(bookingApi.getBooking).not.toHaveBeenCalled();
  });

  it('returns error state when booking not found', async () => {
    vi.mocked(bookingApi.getBooking).mockRejectedValue({
      message: 'Booking not found',
      code: 'BOOKING_NOT_FOUND',
      status: 404,
    });

    const { result } = renderHook(() => useBooking('BK-INVALID'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
