import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/database.js';

let branchId: string;
let slotId: string;

afterEach(async () => {
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.branch.deleteMany();
});

beforeEach(async () => {
  const branch = await prisma.branch.create({
    data: {
      name: 'Booking Test Branch',
      location: 'Test Mall',
      address: '1 Test St',
      city: 'Johannesburg',
      province: 'Gauteng',
      openingTime: '08:00',
      closingTime: '09:00',
    },
  });
  branchId = branch.id;

  const slot = await prisma.timeSlot.create({
    data: {
      branchId,
      slotDate: new Date('2026-12-01'),
      startTime: '08:00',
      endTime: '08:30',
      isBooked: false,
    },
  });
  slotId = slot.id;
});

const validPayload = () => ({
  slotId,
  branchId,
  customerName: 'Thabo Nkosi',
  customerEmail: 'thabo@email.com',
  customerPhone: '0821234567',
});

describe('POST /api/bookings', () => {
  it('201 — creates booking with valid data', async () => {
    const res = await request(app).post('/api/bookings').send(validPayload());
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('bookingReference');
  });

  it('201 — returns booking reference in response', async () => {
    const res = await request(app).post('/api/bookings').send(validPayload());
    expect(res.body.data.bookingReference).toMatch(/^BK-\d{8}-[A-Z0-9]{4}$/);
  });

  it('409 — returns SLOT_UNAVAILABLE when slot is already booked', async () => {
    await request(app).post('/api/bookings').send(validPayload());
    const res = await request(app).post('/api/bookings').send(validPayload());
    expect(res.status).toBe(409);
    expect(res.body.code).toBe('SLOT_UNAVAILABLE');
  });

  it('404 — returns SLOT_NOT_FOUND when slot does not exist', async () => {
    const res = await request(app).post('/api/bookings').send({
      ...validPayload(),
      slotId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    });
    expect(res.status).toBe(404);
  });

  it('404 — returns BRANCH_NOT_FOUND when branch does not exist', async () => {
    const res = await request(app).post('/api/bookings').send({
      ...validPayload(),
      branchId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567891',
    });
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('BRANCH_NOT_FOUND');
  });

  it('422 — returns VALIDATION_ERROR with invalid email', async () => {
    const res = await request(app).post('/api/bookings').send({
      ...validPayload(),
      customerEmail: 'not-an-email',
    });
    expect(res.status).toBe(422);
  });

  it('422 — returns VALIDATION_ERROR with missing customerName', async () => {
    const { customerName: _, ...rest } = validPayload();
    const res = await request(app).post('/api/bookings').send(rest);
    expect(res.status).toBe(422);
  });

  it('422 — returns VALIDATION_ERROR with invalid slotId UUID', async () => {
    const res = await request(app).post('/api/bookings').send({
      ...validPayload(),
      slotId: 'not-a-uuid',
    });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/bookings/:bookingReference', () => {
  it('200 — returns booking with nested slot and branch data', async () => {
    const createRes = await request(app).post('/api/bookings').send(validPayload());
    const ref = createRes.body.data.bookingReference;

    const res = await request(app).get(`/api/bookings/${ref}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('slot');
    expect(res.body.data).toHaveProperty('branch');
  });

  it('404 — returns BOOKING_NOT_FOUND for unknown reference', async () => {
    const res = await request(app).get('/api/bookings/BK-00000000-XXXX');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('BOOKING_NOT_FOUND');
  });
});