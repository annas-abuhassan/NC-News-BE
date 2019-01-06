const { User, Article, Comment } = require('../models');
const { checkDoc, generalLog } = require('../utils');

const getUsers = (req, res, next) => {
  User.find().then(users => {
    res.send({ users });
    generalLog(req, res);
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
      generalLog(req, res);
    })
    .catch(next);
};

module.exports = { getUsers, getUserByID };
