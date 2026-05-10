import { prisma } from '../../src/config/database.js';

afterEach(async () => {
  // Clean up test data in reverse FK order
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.branch.deleteMany();
});
