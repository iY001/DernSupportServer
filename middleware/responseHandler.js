/**
 * Standardized Response Handler
 * Formats all API responses in a consistent structure
 */

const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const sendError = (res, message = 'Error', statusCode = 400, details = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  });
};

const responseHandler = (req, res, next) => {
  res.sendSuccess = (data, message, statusCode) => sendSuccess(res, data, message, statusCode);
  res.sendError = (message, statusCode, details) => sendError(res, message, statusCode, details);
  next();
};

module.exports = {
  responseHandler,
  sendSuccess,
  sendError,
};
