const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mapping: product ID => correct image path
// Based on product names from database
const imageMapping = {
  // === MIE AYAM CHILI OIL (merah, kering, tanpa kuah) ===
  13: '/images/mie-chili-oil.png',           // Mie Ayam Chili Oil
  14: '/images/mie-chili-oil-bakso.png',      // Mie Ayam Chili Oil Bakso / Pangsit Basah
  15: '/images/mie-chili-oil-bakso.png',      // Mie Ayam Chili Oil Komplit (bakso + pangsit basah + pangsit kering)
  
  // === MIE AYAM YAMIN (kecap manis, gelap) ===
  16: '/images/mie-yamin.jpg',                // Mie Ayam Yamin
  23: '/images/mie-yamin.jpg',                // Mie Ayam Yamin Bakso / Pangsit Basah
  24: '/images/mie-yamin.jpg',                // Mie Ayam Yamin Komplit
  
  // === MIE AYAM HIJAU ===
  25: '/images/mie-hijau.jpg',                // Mie Ayam Hijau Chili Oil
  26: '/images/mie-hijau.jpg',                // Mie Ayam Hijau Yamin
  27: '/images/mie-hijau.jpg',                // Mie Ayam Hijau Bakso / Pangsit Basah
  28: '/images/mie-hijau.jpg',                // Mie Ayam Hijau Komplit
  
  // === MINUMAN ===
  17: '/images/es-teh-manis.jpg',             // Es Teh Manis
  18: '/images/teh-manis-hangat.jpg',         // Teh Manis Hangat
  19: '/images/es-jeruk.jpg',                 // Es Jeruk
  20: '/images/jeruk-hangat.jpg',             // Jeruk Hangat
  21: '/images/teh-pucuk.jpg',                // Teh Pucuk
  22: '/images/air-mineral.jpg',              // Air Mineral
};

async function main() {
  console.log('Updating all product images...\n');
  
  for (const [id, imageUrl] of Object.entries(imageMapping)) {
    try {
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: { imageUrl },
      });
      console.log(`✓ [${id}] ${product.name} → ${imageUrl}`);
    } catch (err) {
      console.error(`✗ [${id}] Failed: ${err.message}`);
    }
  }
  
  console.log('\nAll product images updated!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
