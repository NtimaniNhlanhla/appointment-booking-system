import 'dotenv/config';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Branch data ─────────────────────────────────────────────
// To add a new branch, edit prisma/data/branches.json — no TypeScript changes needed.
interface BranchSeed {
  name: string;
  location: string;
  address: string;
  city: string;
  province: string;
  openingTime: string;
  closingTime: string;
  imageUrl?: string;
}

async function loadBranches(): Promise<BranchSeed[]> {
  const filePath = resolve(process.cwd(), 'prisma', 'data', 'branches.json');
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as BranchSeed[];
}

// ─── Slot generation ─────────────────────────────────────────
interface SlotInput {
  startTime: string;
  endTime: string;
}

function generateSlots(openingTime: string, closingTime: string): SlotInput[] {
  const slots: SlotInput[] = [];
  const [openH = 0, openM = 0] = openingTime.split(':').map(Number);
  const [closeH = 0, closeM = 0] = closingTime.split(':').map(Number);

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

  const branches = await loadBranches();
  console.log(`  📋 Loaded ${branches.length} branches from prisma/data/branches.json`);

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