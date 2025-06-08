import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    // Write all logs with level `info` and above to console
    new transports.Console(),
    // Write all logs to `app.log`
    new transports.File({ filename: 'logs/app.log' }),
    // Write all errors to `error.log`
    new transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

export default logger;