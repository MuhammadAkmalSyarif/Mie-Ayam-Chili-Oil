const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');

const images = {
  'jeruk-hangat.jpg': 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&h=400&fit=crop', // hot lemon/orange drink
  'air-mineral.jpg': 'https://images.unsplash.com/photo-1616118132534-381148898bb4?w=400&h=400&fit=crop', // water bottle
  'mie-hijau.jpg': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', // green spinach noodles/pasta
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
    try { await download(url, dest); } catch (err) { console.error(`  FAILED: ${err.message}`); }
  }
  console.log('Done!');
}
main();
