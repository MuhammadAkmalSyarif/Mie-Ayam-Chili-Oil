const { PrismaClient } = require('@prisma/client');
const path = require('path');

async function test(name, dbPath) {
  process.env.DATABASE_URL = `file:${dbPath}`;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`
      }
    }
  });
  try {
    const products = await prisma.product.findMany();
    console.log(`--- ${name} (${dbPath}) ---`);
    console.log(`Count: ${products.length}`);
    products.forEach(p => console.log(` - ${p.name} (ID: ${p.id})`));
  } catch (e) {
    console.error(`--- ${name} (${dbPath}) failed: ---`, e.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  const path1 = path.resolve(__dirname, '../dev.db');
  const path2 = path.resolve(__dirname, '../prisma/dev.db');
  const path3 = path.resolve(__dirname, 'old-dev.db');
  const path4 = path.resolve(__dirname, 'init-dev.db');
  console.log('Path 1 (backend/dev.db):', path1);
  console.log('Path 2 (backend/prisma/dev.db):', path2);
  console.log('Path 3 (backend/scratch/old-dev.db):', path3);
  console.log('Path 4 (backend/scratch/init-dev.db):', path4);
  await test('backend/dev.db', path1);
  await test('backend/prisma/dev.db', path2);
  await test('backend/scratch/old-dev.db', path3);
  await test('backend/scratch/init-dev.db', path4);
}

run();
