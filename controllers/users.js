const { User } = require("../models");
const { checkId } = require("../utils");

const getUsers = (req, res, next) => {
  User.find().then(users => {
    res.send({ users });
  });
};

const getUserByUsername = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      checkId(user);
      res.send({ user });
    })
    .catch(next);
};

module.exports = { getUsers, getUserByUsername };
