const { Topic, Article } = require("../models");

const getTopics = (req, res, next) => {
  Topic.find().then(topics => res.send({ topics }));
};


module.exports = { getTopics };
