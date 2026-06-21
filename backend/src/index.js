require('dotenv').config();

// SQLite Vercel Serverless workaround
const fs = require('fs');
const path = require('path');
const tempDbPath = '/tmp/dev.db';
const bundledDbPath = path.join(__dirname, '../dev.db');

if (process.env.NODE_ENV === 'production') {
  console.log('--- DB DEBUG START ---');
  console.log('__dirname:', __dirname);
  console.log('process.cwd():', process.cwd());
  console.log('process.env.DATABASE_URL:', JSON.stringify(process.env.DATABASE_URL));
  
  const bundledDbPath1 = path.join(__dirname, '../dev.db');
  const bundledDbPath2 = path.join(__dirname, '../prisma/dev.db');
  
  console.log(`bundledDbPath1 (${bundledDbPath1}) exists:`, fs.existsSync(bundledDbPath1));
  if (fs.existsSync(bundledDbPath1)) {
    const stat1 = fs.statSync(bundledDbPath1);
    console.log('bundledDbPath1 size:', stat1.size);
  }
  
  console.log(`bundledDbPath2 (${bundledDbPath2}) exists:`, fs.existsSync(bundledDbPath2));
  if (fs.existsSync(bundledDbPath2)) {
    const stat2 = fs.statSync(bundledDbPath2);
    console.log('bundledDbPath2 size:', stat2.size);
  }

  const chosenBundledPath = fs.existsSync(bundledDbPath1) ? bundledDbPath1 : (fs.existsSync(bundledDbPath2) ? bundledDbPath2 : null);

  if (!fs.existsSync(tempDbPath)) {
    try {
      if (chosenBundledPath) {
        fs.copyFileSync(chosenBundledPath, tempDbPath);
        console.log(`Database successfully copied from ${chosenBundledPath} to ${tempDbPath}`);
      } else {
        console.error('No bundled database found to copy!');
      }
    } catch (err) {
      console.error('Failed to copy database to /tmp:', err);
    }
  } else {
    console.log('tempDbPath already exists. Size:', fs.statSync(tempDbPath).size);
  }
  process.env.DATABASE_URL = `file:${tempDbPath}`;
  console.log('process.env.DATABASE_URL set to:', process.env.DATABASE_URL);
  console.log('--- DB DEBUG END ---');
}

const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Mie Ayam Chili Oil API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
