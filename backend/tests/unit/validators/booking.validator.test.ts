import { createBookingSchema } from '../../../src/validators/booking.validator.js';

const validInput = {
  slotId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  branchId: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  customerName: 'Thabo Nkosi',
  customerEmail: 'thabo@email.com',
  customerPhone: '0821234567',
};

describe('createBookingSchema', () => {
  it('passes with valid input', () => {
    expect(createBookingSchema.safeParse(validInput).success).toBe(true);
  });

  it('fails with invalid UUID for slotId', () => {
    const result = createBookingSchema.safeParse({ ...validInput, slotId: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('fails with invalid email', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerEmail: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('fails when customerName is empty', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerName: '' });
    expect(result.success).toBe(false);
  });

  it('fails when customerName is too short', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerName: 'A' });
    expect(result.success).toBe(false);
  });
});