const { User } = require("../models");
const { checkDoc } = require("../utils");

const getUsers = (req, res, next) => {
  User.find().then(users => {
    res.send({ users });
  });
};

const getUserByUsername = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      checkDoc(user);
      res.send({ user });
    })
    .catch(next);
};

module.exports = { getUsers, getUserByUsername };
