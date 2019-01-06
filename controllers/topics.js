const { Topic } = require('../models');
const { generalLog } = require('../utils');

const getTopics = (req, res, next) => {
  Topic.find().then(topics => {
    res.send({ topics });
    generalLog(req, res);
  });
};

module.exports = { getTopics };
