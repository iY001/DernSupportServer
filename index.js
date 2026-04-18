/**
 * DernSupport Backend Server
 * Main entry point for the application
 */

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const config = require('./config/environment');
const { responseHandler } = require('./middleware/responseHandler');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// ========================================
// Security Middleware
// ========================================

// Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit login attempts
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

// Apply rate limiter to all routes
app.use(limiter);

// ========================================
// Body Parser & Compression
// ========================================

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());

// ========================================
// Response Handler Middleware
// ========================================

app.use(responseHandler);

// ========================================
// Health Check Route
// ========================================

app.get('/health', (req, res) => {
  res.sendSuccess({ status: 'OK' }, 'Server is running', 200);
});

app.get('/', (req, res) => {
  res.sendSuccess({ version: '1.0.0' }, 'Welcome to DernSupport API', 200);
});

// ========================================
// API Routes
// ========================================

// Authentication routes (with stricter rate limiting)
app.use('/user', authLimiter, require('./routes/User'));

// Protected routes (require authorization)
const checkAuthorized = require('./middleware/checkAuthorized');
app.use('/tickets', checkAuthorized, require('./routes/Tickets'));
app.use('/replies', checkAuthorized, require('./routes/Replies'));

// Public routes
app.use('/problems', require('./routes/Problems'));
app.use('/images', require('./routes/Images'));
app.use('/aichat', require('./routes/aiChat'));

// Seed & Demo routes (for development/demo only)
app.use('/seed', require('./routes/seed'));

// ========================================
// 404 Handler
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// Global Error Handler
// ========================================

app.use(errorHandler);

// ========================================
// Server Startup
// ========================================

const PORT = config.server.port;

let server;

// Vercel runs the app as a serverless function, so don't open a persistent port there.
if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    logger.info(`Server running in ${config.server.nodeEnv} mode`, {
      port: PORT,
      url: `http://localhost:${PORT}`,
    });
  });
}

// ========================================
// Graceful Shutdown
// ========================================

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  }
});

// ========================================
// Unhandled Promise Rejection
// ========================================

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
});

module.exports = app;

