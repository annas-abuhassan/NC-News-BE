const { User, Article, Comment } = require("../models");
const { checkDoc } = require("../utils");

const getUsers = (req, res, next) => {
  User.find().then(users => {
    res.send({ users });
  });
};

const getUserByID = (req, res, next) => {
  const { _id } = req.params;
  return Promise.all([
    Comment.find({ created_by: _id }),
    Article.find({ created_by: _id }),
    User.findOne({ _id: _id }).lean()
  ])
    .then(([comments, articles, user]) => {
      checkDoc(user);
      user = { ...user, articles, comments };
      res.send({ user });
    })
    .catch(next);
};

module.exports = { getUsers, getUserByID };
