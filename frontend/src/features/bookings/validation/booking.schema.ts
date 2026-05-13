import { z } from 'zod';

export const bookingSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z
    .string()
    .regex(/^(\+27|0027|0)[6-8]\d{8}$/, 'Please enter a valid South African cell number (e.g. 0821234567 or +27821234567)'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;