// const log = require('../logger.js');
// const savedLogs = require('../log.json');

const getLogs = (req, res, next) => {
  console.log('I AM UPDATED LOG LEVEL');
};

const updateLogLevel = (req, res, next) => {
  console.log('I AM UPDATED LOG LEVEL');
};

module.exports = {
  getLogs,
  updateLogLevel
};
