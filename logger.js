const { createLogger, format, transports } = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');
const { accessKeyId, secretAccessKey, region } = require('./config'); // Comment this out if you don't want to setup AWS

const log = createLogger({
  level: process.env.LOGGING_LEVEL || 'debug',
  silent: process.env.NODE_ENV === 'test' ? true : false,
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
    // Comment out this Transport instance if you don't want to setup AWS
    new CloudWatchTransport({
      logGroupName: 'northcoders-news',
      logStreamName: 'test-stream',
      createLogGroup: true,
      createLogStream: true,
      submissionInterval: 2000,
      submissionRetryCount: 1,
      batchSize: 20,
      awsConfig: {
        accessKeyId,
        secretAccessKey,
        region
      },
      formatLog: item => `${item.level}: ${item.message}`
    })
    // Comment out this Transport instance if you don't want to setup AWS
  ]
});
module.exports = log;
