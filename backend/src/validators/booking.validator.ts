import { z } from 'zod';

export const createBookingSchema = z.object({
  slotId: z.string().uuid(),
  branchId: z.string().uuid(),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10).max(20),
  notes: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;