const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating product images...');

  // Update Mie Ayam Chili Oil (IDs might vary, but I'll use names to be safe)
  await prisma.product.updateMany({
    where: { name: { contains: 'Chili Oil' }, NOT: { name: { contains: 'Hijau' } } },
    data: { imageUrl: '/images/mie-chili-oil.png' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'Bakso' }, NOT: { name: { contains: 'Hijau' } } },
    data: { imageUrl: '/images/mie-bakso.png' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'Hijau' } },
    data: { imageUrl: '/images/mie-hijau.png' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'Jeruk' } },
    data: { imageUrl: '/images/es-jeruk.png' }
  });

  await prisma.product.updateMany({
    where: { name: { contains: 'Teh' } },
    data: { imageUrl: '/images/mie-chili-oil.png' } // Fallback for drinks if no specific image
  });
  
  await prisma.product.updateMany({
    where: { name: { contains: 'Yamin' }, imageUrl: { startsWith: 'http' } },
    data: { imageUrl: '/images/mie-chili-oil.png' }
  });

  console.log('Product images updated successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
