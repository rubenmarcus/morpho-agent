import winston from 'winston';

/**
 * Winston logger configuration for the Morpho API
 */
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

/**
 * Logs an API request
 * @param method - HTTP method
 * @param path - Request path
 * @param params - Request parameters
 */
export function logRequest(method: string, path: string, params: Record<string, any>) {
  logger.info('API Request', {
    method,
    path,
    params,
    timestamp: new Date().toISOString()
  });
}

/**
 * Logs an API error
 * @param error - Error object
 * @param context - Additional context information
 */
export function logError(error: Error, context?: Record<string, any>) {
  logger.error('API Error', {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    context,
    timestamp: new Date().toISOString()
  });
}