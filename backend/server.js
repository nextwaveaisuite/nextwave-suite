const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const nicheRoutes = require('./routes/niches');
const campaignRoutes = require('./routes/campaigns');
const trendRoutes = require('./routes/trends');
const integrationRoutes = require('./routes/integrations');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/niches', nicheRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/trends', trendRoutes);
app.use('/api/integrations', integrationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Affiliate Suite Backend API                         ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Timestamp: ${new Date().toISOString()}          ║
║                                                           ║
║   Available Endpoints:                                    ║
║   - GET  /health                                          ║
║   - POST /api/auth/register                               ║
║   - POST /api/auth/login                                  ║
║   - GET  /api/niches                                      ║
║   - POST /api/niches/export                               ║
║   - GET  /api/campaigns                                   ║
║   - POST /api/campaigns/create                            ║
║   - GET  /api/trends/discover                             ║
║   - POST /api/integrations/clickbank/connect              ║
║   - POST /api/integrations/bing/connect                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
