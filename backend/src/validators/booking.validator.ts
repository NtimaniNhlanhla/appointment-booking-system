import { z } from 'zod';

export const createBookingSchema = z.object({
  slotId: z.string().uuid(),
  branchId: z.string().uuid(),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z
    .string()
    .regex(/^(\+27|0027|0)[6-8]\d{8}$/, 'Please enter a valid South African cell number (e.g. 0821234567 or +27821234567)'),
  notes: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;