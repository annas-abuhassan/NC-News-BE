const { Topic } = require('../models');
const { log } = require('../logger.js');

const getTopics = (req, res, next) => {
  Topic.find().then(topics => {
    res.send({ topics });
    log.debug(
      `"Method: '${req.method}' URL: '${req.baseUrl}' STATUS CODE: '${
        res.statusCode
      }'`
    );
  });
};

module.exports = { getTopics };
