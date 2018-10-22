const { User, Article } = require("../models");
const { checkDoc } = require("../utils");

const getUsers = (req, res, next) => {
  User.find().then(users => {
    res.send({ users });
  });
};

const getUserByID = (req, res, next) => {
  return Promise.all([
    Article.find().populate("created_by"),
    User.findOne({ _id: req.params._id })
  ])
    .then(([articles, user]) => {
      checkDoc(user);
      res.send({ user });
    })
    .catch(next);
};

module.exports = { getUsers, getUserByID };
