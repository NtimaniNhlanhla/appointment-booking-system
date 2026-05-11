import { execSync } from 'child_process';
import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/database.js';

async function seedIfEmpty() {
  const branchCount = await prisma.branch.count();
  if (branchCount === 0) {
    logger.info('No data found — running database seed...');
    execSync('npm run db:seed', { stdio: 'inherit' });
    logger.info('Seed complete');
  }
}

async function bootstrap() {
  await prisma.$connect();
  logger.info('Database connected');

  await seedIfEmpty();

  app.listen(Number(env.PORT), () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start server');
  process.exit(1);
});