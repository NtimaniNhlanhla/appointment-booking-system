import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/database.js';

let branchId: string;
const testDate = '2026-12-01';

afterEach(async () => {
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.branch.deleteMany();
});

beforeEach(async () => {
  const branch = await prisma.branch.create({
    data: {
      name: 'Slot Test Branch',
      location: 'Test',
      address: '1 Test St',
      city: 'Johannesburg',
      province: 'Gauteng',
      openingTime: '08:00',
      closingTime: '09:00',
    },
  });
  branchId = branch.id;

  await prisma.timeSlot.createMany({
    data: [
      { branchId, slotDate: new Date(testDate), startTime: '08:00', endTime: '08:30', isBooked: false },
      { branchId, slotDate: new Date(testDate), startTime: '08:30', endTime: '09:00', isBooked: true },
    ],
  });
});

describe('GET /api/slots', () => {
  it('200 — returns all slots for branch + date', async () => {
    const res = await request(app).get(`/api/slots?branchId=${branchId}&date=${testDate}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('200 — booked slots are included with isBooked=true', async () => {
    const res = await request(app).get(`/api/slots?branchId=${branchId}&date=${testDate}`);
    expect(res.status).toBe(200);
    expect(res.body.data.some((s: { isBooked: boolean }) => s.isBooked === true)).toBe(true);
  });

  it('200 — returns empty array when no slots exist for date', async () => {
    const res = await request(app).get(`/api/slots?branchId=${branchId}&date=2099-01-01`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('422 — returns VALIDATION_ERROR when branchId is missing', async () => {
    const res = await request(app).get(`/api/slots?date=${testDate}`);
    expect(res.status).toBe(422);
  });

  it('422 — returns VALIDATION_ERROR when date format is invalid', async () => {
    const res = await request(app).get(`/api/slots?branchId=${branchId}&date=not-a-date`);
    expect(res.status).toBe(422);
  });
});
