import { prisma } from '../config/database.js';
import type { CreateBookingInput } from '../validators/booking.validator.js';

export const bookingRepository = {
  findByReference: (reference: string) =>
    prisma.booking.findUnique({
      where: { bookingReference: reference },
      include: {
        slot: true,
        branch: true,
      },
    }),

  create: (data: CreateBookingInput & { bookingReference: string }) =>
    prisma.$transaction(async (tx) => {
      const slot = await tx.timeSlot.findUnique({ where: { id: data.slotId } });

      if (!slot) throw { code: 'SLOT_NOT_FOUND', status: 404, message: 'Slot not found' };
      if (slot.isBooked) throw { code: 'SLOT_UNAVAILABLE', status: 409, message: 'Slot already booked' };

      await tx.timeSlot.update({
        where: { id: data.slotId },
        data: { isBooked: true },
      });

      return tx.booking.create({
        data: {
          bookingReference: data.bookingReference,
          branchId: data.branchId,
          slotId: data.slotId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          notes: data.notes ?? null,
        },
        include: { slot: true, branch: true },
      });
    }),
};