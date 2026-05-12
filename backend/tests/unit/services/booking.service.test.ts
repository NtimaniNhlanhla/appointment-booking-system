import { jest } from '@jest/globals';

// ESM mocks must be declared before dynamic imports
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockFindByReference = jest.fn();
const mockBranchFindById = jest.fn();
const mockSlotFindById = jest.fn();
const mockSendConfirmation = jest.fn();
const mockGenerateReference = jest.fn(() => 'BK-20261201-ABCD');

jest.unstable_mockModule('../../../src/repositories/booking.repository.js', () => ({
  bookingRepository: { create: mockCreate, findByReference: mockFindByReference },
}));
jest.unstable_mockModule('../../../src/repositories/branch.repository.js', () => ({
  branchRepository: { findById: mockBranchFindById, findAll: jest.fn() },
}));
jest.unstable_mockModule('../../../src/repositories/slot.repository.js', () => ({
  slotRepository: { findById: mockSlotFindById },
}));
jest.unstable_mockModule('../../../src/services/email.service.js', () => ({
  emailService: { sendConfirmation: mockSendConfirmation },
}));
jest.unstable_mockModule('../../../src/utils/generateReference.js', () => ({
  generateBookingReference: mockGenerateReference,
}));

// Dynamic imports AFTER mocks are registered
const { bookingService } = await import('../../../src/services/booking.service.js');

const mockBranch = {
  id: 'branch-1',
  name: 'Test Branch',
  location: 'Mall',
  address: '1 Test St',
  city: 'Johannesburg',
  province: 'Gauteng',
  openingTime: '08:00',
  closingTime: '17:00',
  imageUrl: null,
  createdAt: new Date(),
};

const mockSlot = {
  id: 'slot-1',
  branchId: 'branch-1',
  slotDate: new Date('2026-12-01'),
  startTime: '08:00',
  endTime: '08:30',
  isBooked: false,
  createdAt: new Date(),
};

const mockBooking = {
  id: 'booking-1',
  bookingReference: 'BK-20261201-ABCD',
  slotId: 'slot-1',
  branchId: 'branch-1',
  customerName: 'Thabo Nkosi',
  customerEmail: 'thabo@email.com',
  customerPhone: '0821234567',
  notes: null,
  createdAt: new Date(),
  slot: mockSlot,
  branch: mockBranch,
};

const validInput = {
  slotId: 'slot-1',
  branchId: 'branch-1',
  customerName: 'Thabo Nkosi',
  customerEmail: 'thabo@email.com',
  customerPhone: '0821234567',
};

beforeEach(() => {
  jest.clearAllMocks();
  mockSendConfirmation.mockResolvedValue(void 0);
});

describe('bookingService.create', () => {
  it('creates booking when slot is available', async () => {
    mockBranchFindById.mockResolvedValue(mockBranch);
    mockSlotFindById.mockResolvedValue(mockSlot);
    mockCreate.mockResolvedValue(mockBooking);

    const result = await bookingService.create(validInput);

    expect(result.bookingReference).toBe('BK-20261201-ABCD');
    expect(mockCreate).toHaveBeenCalledWith({
      ...validInput,
      bookingReference: 'BK-20261201-ABCD',
    });
  });

  it('throws BRANCH_NOT_FOUND when branch does not exist', async () => {
    mockBranchFindById.mockResolvedValue(null);

    await expect(bookingService.create(validInput)).rejects.toMatchObject({
      code: 'BRANCH_NOT_FOUND',
      statusCode: 404,
    });
  });

  it('throws SLOT_NOT_FOUND when slot does not exist', async () => {
    mockBranchFindById.mockResolvedValue(mockBranch);
    mockSlotFindById.mockResolvedValue(null);

    await expect(bookingService.create(validInput)).rejects.toMatchObject({
      code: 'SLOT_NOT_FOUND',
      statusCode: 404,
    });
  });

  it('throws SLOT_UNAVAILABLE when slot is already booked', async () => {
    mockBranchFindById.mockResolvedValue(mockBranch);
    mockSlotFindById.mockResolvedValue({ ...mockSlot, isBooked: true });

    await expect(bookingService.create(validInput)).rejects.toMatchObject({
      code: 'SLOT_UNAVAILABLE',
      statusCode: 409,
    });
  });

  it('sends confirmation email after booking (fire and forget)', async () => {
    mockBranchFindById.mockResolvedValue(mockBranch);
    mockSlotFindById.mockResolvedValue(mockSlot);
    mockCreate.mockResolvedValue(mockBooking);

    await bookingService.create(validInput);

    // Give the fire-and-forget promise time to resolve
    await new Promise((r) => setImmediate(r));

    expect(mockSendConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ bookingReference: 'BK-20261201-ABCD' })
    );
  });
});

describe('bookingService.getByReference', () => {
  it('returns booking when reference is valid', async () => {
    mockFindByReference.mockResolvedValue(mockBooking);

    const result = await bookingService.getByReference('BK-20261201-ABCD');
    expect(result.bookingReference).toBe('BK-20261201-ABCD');
  });

  it('throws BOOKING_NOT_FOUND when reference is invalid', async () => {
    mockFindByReference.mockResolvedValue(null);

    await expect(bookingService.getByReference('BK-INVALID-0000')).rejects.toMatchObject({
      code: 'BOOKING_NOT_FOUND',
      statusCode: 404,
    });
  });
});