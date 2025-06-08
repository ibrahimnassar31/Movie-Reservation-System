import logger from '../utils/logger.js';

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Safely extract userId
  const userId = req.user && typeof req.user === 'object' && 'id' in req.user ? req.user.id : null;

  // Log the error with request details
  logger.error(`${statusCode} - ${req.method} ${req.originalUrl} - ${message}`, {
    stack: error.stack,
    userId,
    ip: req.ip || 'unknown'
  });

  res.status(statusCode).json({
    status: 'error',
    message
  });
};