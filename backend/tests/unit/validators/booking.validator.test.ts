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

  it('passes with international +27 cell number', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerPhone: '+27821234567' });
    expect(result.success).toBe(true);
  });

  it('passes with international 0027 cell number', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerPhone: '0027821234567' });
    expect(result.success).toBe(true);
  });

  it('fails when customerPhone contains letters', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerPhone: '082abc4567' });
    expect(result.success).toBe(false);
  });

  it('fails when customerPhone contains special characters', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerPhone: '082-123-4567' });
    expect(result.success).toBe(false);
  });

  it('fails when customerPhone has an invalid SA prefix', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerPhone: '0901234567' });
    expect(result.success).toBe(false);
  });

  it('fails when customerPhone is too short', () => {
    const result = createBookingSchema.safeParse({ ...validInput, customerPhone: '082123' });
    expect(result.success).toBe(false);
  });
});