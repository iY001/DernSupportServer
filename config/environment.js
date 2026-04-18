/**
 * Environment Variables Configuration
 * Validates and exports all environment variables
 * Throws error if required variables are missing
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
];

const optionalEnvVars = {
  PORT: 3000,
  NODE_ENV: 'development',
  JWT_EXPIRE: '7d',
  LOG_LEVEL: 'info',
  FRONTEND_URL: 'http://localhost:3000',
  MAX_FILE_SIZE: 5242880,
  CORS_ORIGIN: 'http://localhost:3000',
};

// Validate required environment variables
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    const message = `Missing required environment variable: ${envVar}. Please check your environment configuration.`;
    if (process.env.VERCEL) {
      console.warn(message);
      return;
    }

    throw new Error(message);
  }
});

module.exports = {
  // Database
  database: {
    url: process.env.DATABASE_URL,
    userPassword: process.env.DATABASE_USER_PASSWORD,
  },

  // Server
  server: {
    port: parseInt(process.env.PORT || 3000, 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '7d',
  },

  // Email
  email: {
    googleAppPassword: process.env.GOOGLE_APP_PASSWORD,
    adminEmail: process.env.ADMIN_EMAIL,
  },

  // AI Services
  ai: {
    openaiKey: process.env.OPENAI_API_KEY,
    cohereKey: process.env.COHERE_API_KEY,
    huggingfaceKey: process.env.HUGGINGFACE_API_KEY,
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || 5242880, 10),
    allowedImageTypes: (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // CORS
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  },

  // Utilities
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
