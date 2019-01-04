const loggerRouter = require('express').Router();
const { getLogLevel, updateLogLevel } = require('../controllers/logger');

loggerRouter.get('/', getLogLevel);
loggerRouter.patch('/', updateLogLevel);

module.exports = loggerRouter;
