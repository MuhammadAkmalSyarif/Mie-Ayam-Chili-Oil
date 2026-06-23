const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log('Local product count:', count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
