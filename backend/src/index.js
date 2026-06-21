require('dotenv').config();

// SQLite Vercel Serverless workaround
const fs = require('fs');
const path = require('path');
const tempDbPath = '/tmp/dev.db';
const bundledDbPath = path.join(__dirname, '../dev.db');

if (process.env.NODE_ENV === 'production') {
  if (!fs.existsSync(tempDbPath)) {
    try {
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tempDbPath);
        console.log('Database successfully copied to /tmp');
      } else {
        console.error('Bundled database not found at:', bundledDbPath);
      }
    } catch (err) {
      console.error('Failed to copy database to /tmp:', err);
    }
  }
  process.env.DATABASE_URL = `file:${tempDbPath}`;
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
