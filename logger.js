const { createLogger, format, transports } = require('winston');

const log = createLogger({
  level: process.env.LOGGING_LEVEL || 'debug',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          debug => `${debug.timestamp} ${debug.level}: ${debug.message}`
        )
      )
    }),
    new transports.File({ filename: `${__dirname}/log.json` })
  ]
});
module.exports = log;
