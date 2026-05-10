import { generateBookingReference } from '../../../src/utils/generateReference.js';

describe('generateBookingReference', () => {
  it('returns string matching BK-YYYYMMDD-XXXX format', () => {
    const ref = generateBookingReference();
    expect(ref).toMatch(/^BK-\d{8}-[A-Z0-9]{4}$/);
  });

  it('generates unique references across multiple calls', () => {
    const refs = new Set(Array.from({ length: 20 }, () => generateBookingReference()));
    expect(refs.size).toBeGreaterThan(1);
  });
});