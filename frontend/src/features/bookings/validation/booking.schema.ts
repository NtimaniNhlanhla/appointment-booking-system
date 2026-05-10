import { z } from 'zod';

export const bookingSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;