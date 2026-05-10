import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createBooking } from '../api/bookingApi.ts';
import type { CreateBookingPayload } from '../types/booking.types.ts';

export function useCreateBooking(branchId: string, date: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ['slots', branchId, date] });
      toast.success('Appointment booked successfully!');
      navigate(`/confirmation/${booking.bookingReference}`);
    },
    onError: (error: { message: string; code: string }) => {
      if (error.code === 'SLOT_UNAVAILABLE') {
        toast.error('This slot was just taken. Please select another time.');
        queryClient.invalidateQueries({ queryKey: ['slots', branchId, date] });
      } else {
        toast.error(error.message ?? 'Something went wrong. Please try again.');
      }
    },
  });
}