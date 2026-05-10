import request from 'supertest';
import { app } from '../../src/app.js';
import { prisma } from '../../src/config/database.js';

afterEach(async () => {
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.branch.deleteMany();
});

beforeEach(async () => {
  await prisma.branch.createMany({
    data: [
      {
        name: 'Test Sandton',
        location: 'Sandton City',
        address: '123 Main St',
        city: 'Johannesburg',
        province: 'Gauteng',
        openingTime: '08:00',
        closingTime: '17:00',
      },
      {
        name: 'Test Cape Town',
        location: 'Waterfront',
        address: '45 Beach Rd',
        city: 'Cape Town',
        province: 'Western Cape',
        openingTime: '08:00',
        closingTime: '17:00',
      },
    ],
  });
});

describe('GET /api/branches', () => {
  it('200 — returns list of active branches', async () => {
    const res = await request(app).get('/api/branches');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
  });

  it('200 — returns empty array when no branches exist', async () => {
    await prisma.branch.deleteMany();
    const res = await request(app).get('/api/branches');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('200 — filters by search query (name match)', async () => {
    const res = await request(app).get('/api/branches?search=Sandton');
    expect(res.status).toBe(200);
    expect(res.body.data.every((b: { name: string }) => b.name.toLowerCase().includes('sandton'))).toBe(true);
  });

  it('200 — filters by search query (city match)', async () => {
    const res = await request(app).get('/api/branches?search=Cape+Town');
    expect(res.status).toBe(200);
    expect(res.body.data.some((b: { city: string }) => b.city === 'Cape Town')).toBe(true);
  });
});

describe('GET /api/branches/:id', () => {
  it('200 — returns single branch', async () => {
    const branch = await prisma.branch.findFirst({ where: { name: 'Test Sandton' } });
    const res = await request(app).get(`/api/branches/${branch!.id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(branch!.id);
  });

  it('404 — returns BRANCH_NOT_FOUND for unknown ID', async () => {
    const res = await request(app).get('/api/branches/a1b2c3d4-e5f6-7890-abcd-ef1234567899');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('BRANCH_NOT_FOUND');
  });
});
