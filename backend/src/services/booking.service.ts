import { bookingRepository } from '../repositories/booking.repository.js';
import { branchRepository } from '../repositories/branch.repository.js';
import { slotRepository } from '../repositories/slot.repository.js';
import { emailService } from './email.service.js';
import { generateBookingReference } from '../utils/generateReference.js';
import { ApiError } from '../utils/ApiError.js';
import type { CreateBookingInput } from '../validators/booking.validator.js';

export const bookingService = {
 async create(input: CreateBookingInput) {
    const branch = await branchRepository.findById(input.branchId);
    if (!branch) throw new ApiError('BRANCH_NOT_FOUND', 404, 'Branch not found');

    const slot = await slotRepository.findById(input.slotId);
    if (!slot) throw new ApiError('SLOT_NOT_FOUND', 404, 'Slot not found');
    if (slot.isBooked) throw new ApiError('SLOT_UNAVAILABLE', 409, 'This time slot is no longer available');

    const bookingReference = generateBookingReference();
    const booking = await bookingRepository.create({ ...input, bookingReference });

    // Fire and forget — email failure must not fail the booking
    emailService.sendConfirmation({
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingReference: booking.bookingReference,
      branchName: booking.branch.name,
      slotDate: booking.slot.slotDate.toISOString().slice(0, 10),
      startTime: booking.slot.startTime,
      endTime: booking.slot.endTime,
    }).catch((err) => console.error('Email send failed (non-critical):', err));

    return booking;
  },

  async getByReference(reference: string) {
    const booking = await bookingRepository.findByReference(reference);
    if (!booking) throw new ApiError('BOOKING_NOT_FOUND', 404, 'Booking not found');
    return booking;
  },
};