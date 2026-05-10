import { useQuery } from '@tanstack/react-query';
import { getBooking } from '../api/bookingApi';

export function useBooking(reference: string) {
  return useQuery({
    queryKey: ['booking', reference],
    queryFn: () => getBooking(reference),
    enabled: !!reference,
  });
}