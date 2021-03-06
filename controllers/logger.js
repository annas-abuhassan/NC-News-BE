const log = require('../logger.js');
const { generalLog } = require('../utils');
const { password } =
  process.env.NODE_ENV === 'production' ? process.env : require('../config');

const getLogLevel = (req, res, next) => {
  res.send({ msg: `The current log level is ${log.level}` });
  generalLog(req, res);
};

const updateLogLevel = (req, res, next) => {
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

      res.send({ level: log.level, msg: updateMessage });
      log.debug(updateMessage);
    } else {
      res.status(400).send({
        msg: `${
          req.query.level
        } is not a valid logging level. Please select either 'debug' or 'error`
      });

      log.error(`Invalid logging level used: ${req.query.level}`);
    }
  } else {
    res.status(400).send({
      msg: 'Incorrect password. Please contact your admin for this information.'
    });
    log.error(`Invalid password used: ${req.query.password}`);
  }
  generalLog(req, res);
};

module.exports = { getLogLevel, updateLogLevel };
