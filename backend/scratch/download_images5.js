const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');

// Using Pexels free images (stable URLs)
const images = {
  // Jeruk hangat - warm orange drink
  'jeruk-hangat.jpg': 'https://images.unsplash.com/photo-1544252890-c88008cb4102?w=400&h=400&fit=crop',
  // Green noodles - matcha/green tea/spinach noodles
  'mie-hijau.jpg': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=400&fit=crop',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400) {
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
