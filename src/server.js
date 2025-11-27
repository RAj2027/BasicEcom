// FitCheckCo. E-Commerce Backend Server
const express = require('express');
const path = require('path');
const cors = require('cors');

// Initialize Express app
const app = express();

// CORS Configuration - Allow all origins for development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files (frontend)
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/views', express.static(path.join(__dirname, '../views')));

// Import database connection (this will auto-create tables)
const db = require('./config/db');

// Import routes
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Register routes
app.use('/cart', cartRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Test root route
app.get('/', (req, res) => {
  res.json({
    status: 'API running',
    message: 'FitCheckCo. E-Commerce API is live!',
    version: '1.0.0'
  });
});

// Serve home page
app.get('/views/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/home.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server configuration
const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 FitCheckCo. Server Started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}`);
  console.log(`🏠 Home: http://localhost:${PORT}/views/home.html`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⚠️  Shutting down server...');
  db.end((err) => {
    if (err) {
      console.error('❌ Error closing database connection:', err.message);
    } else {
      console.log('✅ Database connection closed');
    }
    process.exit(0);
  });
});

module.exports = app;
