/**
 * Logger Utility
 * Simple logging system for development and production
 */

const fs = require('fs');
const path = require('path');

const isVercel = Boolean(process.env.VERCEL);
const logsDir = isVercel ? '/tmp/dernsupport-logs' : path.join(__dirname, '../logs');
let fileLoggingEnabled = !isVercel;

// Create logs directory if it doesn't exist
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  fileLoggingEnabled = false;
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const logToFile = (level, data) => {
  if (process.env.NODE_ENV === 'production' && fileLoggingEnabled) {
    try {
      const logFile = path.join(logsDir, `${level}-${new Date().toISOString().split('T')[0]}.log`);
      const logEntry = `[${getTimestamp()}] ${JSON.stringify(data)}\n`;
      fs.appendFileSync(logFile, logEntry);
    } catch (error) {
      fileLoggingEnabled = false;
    }
  }
};

const logToConsole = (level, message, data = '') => {
  const colors = {
    info: '\x1b[36m',    // cyan
    error: '\x1b[31m',   // red
    warn: '\x1b[33m',    // yellow
    debug: '\x1b[35m',   // magenta
    reset: '\x1b[0m',
  };

  const prefix = process.env.NODE_ENV === 'production' ? '' : colors[level] || colors.reset;
  const reset = process.env.NODE_ENV === 'production' ? '' : colors.reset;

  console.log(`${prefix}[${level.toUpperCase()}] ${getTimestamp()} - ${message}${reset}`, data ? data : '');
};

const logger = {
  info: (message, data) => {
    logToConsole('info', message, data);
    logToFile('info', { message, data });
  },

  error: (message, data) => {
    logToConsole('error', typeof message === 'string' ? message : message.message, data);
    logToFile('error', typeof message === 'string' ? { message, data } : message);
  },

  warn: (message, data) => {
    logToConsole('warn', message, data);
    logToFile('warn', { message, data });
  },

  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      logToConsole('debug', message, data);
    }
  },
};

module.exports = logger;
