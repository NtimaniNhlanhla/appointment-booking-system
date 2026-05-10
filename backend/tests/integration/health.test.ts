import request from 'supertest';
import { app } from '../../src/app.js';

describe('GET /api/health', () => {
  it('200 — returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('ok');
  });
});
