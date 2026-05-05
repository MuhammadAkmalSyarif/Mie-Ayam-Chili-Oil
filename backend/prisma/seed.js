const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItemTopping.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.topping.deleteMany();

  // Create Categories
  const catMakanan = await prisma.category.create({
    data: { name: 'Makanan' },
  });

  const catMinuman = await prisma.category.create({
    data: { name: 'Minuman' },
  });

  // Create Toppings
  const toppings = [
    { name: 'Ekstra Chili Oil', price: 2000 },
    { name: 'Telur Puyuh (3 tusuk)', price: 5000 },
    { name: 'Ceker (2 pcs)', price: 4000 },
    { name: 'Bakso (2 pcs)', price: 5000 },
  ];

  for (const topping of toppings) {
    await prisma.topping.create({ data: topping });
  }

  // Create Products
  const products = [
    {
      name: 'Mie Ayam Chili Oil Original',
      description: 'Mie kenyal dengan bumbu chili oil khas, ayam tabur, dan sayuran.',
      basePrice: 15000,
      categoryId: catMakanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Mie Ayam Chili Oil + Bakso',
      description: 'Mie Ayam Chili Oil dengan tambahan 2 bakso sapi.',
      basePrice: 20000,
      categoryId: catMakanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Mie Ayam Chili Oil + Pangsit',
      description: 'Mie Ayam Chili Oil dengan tambahan pangsit rebus.',
      basePrice: 18000,
      categoryId: catMakanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Kerupuk Pangsit (Porsi)',
      description: 'Pangsit goreng renyah isi 5.',
      basePrice: 5000,
      categoryId: catMakanan.id,
      imageUrl: 'https://images.unsplash.com/photo-1626700051175-656fc7bc30dd?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Es Teh Manis',
      description: 'Teh manis dingin segar.',
      basePrice: 5000,
      categoryId: catMinuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Teh Manis Hangat',
      description: 'Teh manis hangat yang menenangkan.',
      basePrice: 5000,
      categoryId: catMinuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1563514917540-02ddbf1794b1?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Es Jeruk',
      description: 'Perasan jeruk segar dengan es.',
      basePrice: 7000,
      categoryId: catMinuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Jeruk Hangat',
      description: 'Perasan jeruk asli hangat.',
      basePrice: 7000,
      categoryId: catMinuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1523456764772-28bb30378852?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Teh Pucuk',
      description: 'Minuman teh kemasan segar.',
      basePrice: 5000,
      categoryId: catMinuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1620330101564-984cd123568c?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Air Mineral',
      description: 'Air mineral botol dingin.',
      basePrice: 4000,
      categoryId: catMinuman.id,
      imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&q=80',
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Seed data successfully created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
