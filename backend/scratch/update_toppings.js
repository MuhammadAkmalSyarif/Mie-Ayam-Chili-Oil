const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing toppings...');
  await prisma.topping.deleteMany({});
  
  console.log('Creating new toppings...');
  await prisma.topping.createMany({
    data: [
      { name: 'Bakso', price: 3000 },
      { name: 'Pangsit Basah', price: 3000 }
    ]
  });
  
  console.log('Toppings updated successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
