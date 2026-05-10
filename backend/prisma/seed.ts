import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── Branch data ────────────────────────────────────────────
const branches = [
  {
    name: 'Sandton Branch',
    location: 'Sandton City Mall',
    address: 'Shop 123, Sandton City, 83 Rivonia Rd',
    city: 'Johannesburg',
    province: 'Gauteng',
    openingTime: '08:00',
    closingTime: '17:00',
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80',
  },
  {
    name: 'Rosebank Branch',
    location: 'The Zone @ Rosebank',
    address: 'Shop 34, The Zone, Oxford Road',
    city: 'Johannesburg',
    province: 'Gauteng',
    openingTime: '08:00',
    closingTime: '17:00',
    imageUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&q=80',
  },
  {
    name: 'Pretoria Branch',
    location: 'Menlyn Maine',
    address: 'Shop 12, Menlyn Maine, Cnr Atterbury & Lois Ave',
    city: 'Pretoria',
    province: 'Gauteng',
    openingTime: '08:00',
    closingTime: '17:00',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
  },
  {
    name: 'Midrand Branch',
    location: 'Mall of Africa',
    address: 'Shop 67, Mall of Africa, Lone Creek Crescent',
    city: 'Johannesburg',
    province: 'Gauteng',
    openingTime: '09:00',
    closingTime: '17:00',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
  },
  {
    name: 'Cape Town Branch',
    location: 'V&A Waterfront',
    address: 'Shop 45, V&A Waterfront',
    city: 'Cape Town',
    province: 'Western Cape',
    openingTime: '08:00',
    closingTime: '17:00',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
];

// ─── Slot generation ─────────────────────────────────────────
interface SlotInput {
  startTime: string;
  endTime: string;
}

function generateSlots(openingTime: string, closingTime: string): SlotInput[] {
  const slots: SlotInput[] = [];
  const [openH, openM] = openingTime.split(':').map(Number);
  const [closeH, closeM] = closingTime.split(':').map(Number);

  let current = openH * 60 + openM;
  const end = closeH * 60 + closeM;

  while (current + 30 <= end) {
    const startH = Math.floor(current / 60).toString().padStart(2, '0');
    const startMin = (current % 60).toString().padStart(2, '0');
    const endTotal = current + 30;
    const endH = Math.floor(endTotal / 60).toString().padStart(2, '0');
    const endMin = (endTotal % 60).toString().padStart(2, '0');

    slots.push({
      startTime: `${startH}:${startMin}`,
      endTime: `${endH}:${endMin}`,
    });

    current += 30;
  }
  return slots;
}

function getNext14Days(): Date[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });
}

// ─── Main seed ───────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding database...');

  for (const branchData of branches) {
    const branch = await prisma.branch.upsert({
      where: { name: branchData.name },
      update: {},
      create: branchData,
    });

    console.log(`  ✓ Branch: ${branch.name}`);

    const days = getNext14Days();
    const slotTemplate = generateSlots(branch.openingTime, branch.closingTime);

    for (const day of days) {
      const slotsForDay = slotTemplate.map((slot) => ({
        branchId: branch.id,
        slotDate: day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: false,
      }));

      await prisma.timeSlot.createMany({
        data: slotsForDay,
        skipDuplicates: true,
      });
    }

    console.log(`    ↳ ${slotTemplate.length} slots × 14 days = ${slotTemplate.length * 14} slots`);
  }

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });