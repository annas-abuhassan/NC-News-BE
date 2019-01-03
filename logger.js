const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');
const log = createLogger({
  level: process.env.LOGGING_LEVEL || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    new transports.File({ filename: `${__dirname}/log.json` })
  ]
});

const httpLog = expressWinston.logger({
  level: process.env.LOGGING_LEVEL || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    new transports.File({ filename: `${__dirname}/log.json` })
  ],
  meta: false,
  msg: `Method: '{{req.method}}' URL: '{{req.url}}' STATUS CODE: '{{res.statusCode}}' RESPONSE-TIME: '{{res.responseTime}}ms'`
});

module.exports = { log, httpLog };
