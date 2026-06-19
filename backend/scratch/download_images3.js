const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');

// Better matched images
const images = {
  'jeruk-hangat.jpg': 'https://images.unsplash.com/photo-1582012107788-e3e5e2e82747?w=400&h=400&fit=crop', // warm orange/citrus drink in cup
  'air-mineral.jpg': 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=400&h=400&fit=crop', // water bottle
  'mie-yamin.jpg': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop', // dark soy sauce noodles
  'mie-hijau.jpg': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop', // green noodles/pasta
  'teh-pucuk.jpg': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop', // bottled tea drink
  'teh-manis-hangat.jpg': 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=400&fit=crop', // hot tea in glass cup
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303) {
        file.close();
        fs.unlinkSync(dest);
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        console.log(`  OK: ${path.basename(dest)} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve();
      });
    });
    request.on('error', reject);
    request.setTimeout(15000, () => { request.destroy(); reject(new Error('Timeout')); });
  });
}

async function main() {
  for (const [filename, url] of Object.entries(images)) {
    const dest = path.join(imagesDir, filename);
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, dest);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }
  console.log('Done!');
}
main();
