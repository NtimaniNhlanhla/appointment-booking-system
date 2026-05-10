import { apiClient } from '@/services/apiClient';
import { ENDPOINTS } from '@/services/endpoints';
import type { Booking, CreateBookingPayload } from '../types/booking.types';

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await apiClient.post<{ data: Booking }>(ENDPOINTS.BOOKINGS, payload);
  return data.data;
}

export async function getBooking(reference: string): Promise<Booking> {
  const { data } = await apiClient.get<{ data: Booking }>(ENDPOINTS.BOOKING(reference));
  return data.data;
}