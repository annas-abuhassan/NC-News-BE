const { User, Article, Comment } = require('../models');
const { checkDoc } = require('../utils');
const { log } = require('../logger.js');

const getUsers = (req, res, next) => {
  User.find().then(users => {
    res.send({ users });
    log.debug(
      `"Method: '${req.method}' URL: '${req.baseUrl}' STATUS CODE: '${
        res.statusCode
      }'`
    );
  });
};

const getUserByID = (req, res, next) => {
  const { _id } = req.params;
  return Promise.all([
    Comment.find({ created_by: _id }).populate('created_by'),
    Article.find({ created_by: _id }).populate('created_by'),
    User.findOne({ _id: _id }).lean()
  ])
    .then(([comments, articles, user]) => {
      checkDoc(user);
      user = { ...user, articles, comments };
      res.send({ user });
      log.debug(
        `"Method: '${req.method}' URL: '${req.baseUrl}' STATUS CODE: '${
          res.statusCode
        }'`
      );
    })
    .catch(next);
};

module.exports = { getUsers, getUserByID };
