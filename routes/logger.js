const loggerRouter = require('express').Router();
const { getLogs, updateLogLevel } = require('../controllers/logger');

loggerRouter.get('/', getLogs);
loggerRouter.route('/loglevel').patch(updateLogLevel);

module.exports = loggerRouter;
