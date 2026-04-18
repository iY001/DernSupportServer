/**
 * Global Error Handler Middleware
 * Catches and formats all errors in a consistent way
 */

const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    message: err.message,
    statusCode: err.statusCode || 500,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error response
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    statusCode,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace only in development
  if (isDevelopment) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
};
