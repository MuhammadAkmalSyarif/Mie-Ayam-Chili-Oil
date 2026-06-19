const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');

// Unsplash provides free images via their source URL
// These are stable URLs that redirect to actual image files
const images = {
  // Drinks
  'es-teh-manis.jpg': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', // Iced tea
  'teh-manis-hangat.jpg': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop', // Hot tea
  'es-jeruk.jpg': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop', // Orange juice iced
  'jeruk-hangat.jpg': 'https://images.unsplash.com/photo-1615478503562-ec2d8aa0a24d?w=400&h=400&fit=crop', // Warm citrus drink
  'teh-pucuk.jpg': 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&h=400&fit=crop', // Bottled tea
  'air-mineral.jpg': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop', // Water bottle
  // Yamin noodles (dark sweet soy)
  'mie-yamin.jpg': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', // Dark noodles
  // Green noodles  
  'mie-hijau.jpg': 'https://images.unsplash.com/photo-1552611052-33e04de1b100?w=400&h=400&fit=crop', // Green/spinach noodles
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303) {
        const redirectUrl = response.headers.location;
        console.log(`  Redirecting to: ${redirectUrl.substring(0, 60)}...`);
        file.close();
        fs.unlinkSync(dest);
        download(redirectUrl, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        console.log(`  Downloaded: ${path.basename(dest)} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve();
      });
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
    
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function main() {
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  for (const [filename, url] of Object.entries(images)) {
    const dest = path.join(imagesDir, filename);
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, dest);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }
  
  console.log('\nDone!');
}

main();
