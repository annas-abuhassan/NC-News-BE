const log = require('../logger.js');
const { generalLog } = require('../utils');
const { password } = require('../config/logger.js');

const getLogLevel = (req, res, next) => {
  generalLog(req, res);
  res.send(`The current log level is ${log.level}`);
};

const updateLogLevel = (req, res, next) => {
  generalLog(req, res);
  log.debug('Updating log level....');

  const refObj = {
    debug: 'debug',
    error: 'error'
  };

  if (password === req.query.password) {
    log.debug('Correct password used...');
    if (refObj[req.query.level]) {
      const oldLogLevel = log.level;
      log.debug('Valid logging level used...');
      log.level = req.query.level;

      const updateMessage = `Previous log level: ${oldLogLevel}. Log level now set to: ${
        log.level
      }`;

      res.send(updateMessage);
      log.debug(updateMessage);
    } else {
      res
        .status(400)
        .send(
          `${
            req.query.level
          } is not a valid logging level. Please select either 'debug' or 'error`
        );

      log.error(`Invalid logging level used: ${req.query.level}`);
    }
  } else {
    res
      .status(400)
      .send(
        'Incorrect password. Please contact your admin for this information.'
      );
    log.error(`Invalid password used: ${req.query.password}`);
  }
};

module.exports = { getLogLevel, updateLogLevel };
