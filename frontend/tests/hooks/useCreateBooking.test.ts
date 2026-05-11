import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateBooking } from '@/features/bookings/hooks/useCreateBooking';
import * as bookingApi from '@/features/bookings/api/bookingApi';
import { createWrapper } from '../utils/testWrapper';
import type { Booking } from '@/features/bookings/types/booking.types';

vi.mock('@/features/bookings/api/bookingApi');
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { toast } from 'sonner';

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

const payload = {
  slotId: 'slot-uuid',
  branchId: 'branch-uuid',
  customerName: 'Jane Doe',
  customerEmail: 'jane@example.com',
  customerPhone: '0821234567',
};

describe('useCreateBooking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls createBooking API with payload', async () => {
    vi.mocked(bookingApi.createBooking).mockResolvedValue(mockBooking);

    const { result } = renderHook(() => useCreateBooking('branch-uuid', '2026-05-15'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(bookingApi.createBooking).toHaveBeenCalledWith(payload);
  });

  it('shows success toast on successful booking', async () => {
    vi.mocked(bookingApi.createBooking).mockResolvedValue(mockBooking);

    const { result } = renderHook(() => useCreateBooking('branch-uuid', '2026-05-15'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(toast.success).toHaveBeenCalledWith('Appointment booked successfully!');
  });

  it('shows slot unavailable error when slot is taken', async () => {
    vi.mocked(bookingApi.createBooking).mockRejectedValue({
      message: 'Slot is no longer available',
      code: 'SLOT_UNAVAILABLE',
      status: 409,
    });

    const { result } = renderHook(() => useCreateBooking('branch-uuid', '2026-05-15'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith(
      'This slot was just taken. Please select another time.',
    );
  });

  it('shows generic error for other failures', async () => {
    vi.mocked(bookingApi.createBooking).mockRejectedValue({
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
      status: 500,
    });

    const { result } = renderHook(() => useCreateBooking('branch-uuid', '2026-05-15'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith('Internal server error');
  });
});
