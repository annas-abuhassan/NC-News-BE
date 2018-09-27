const { User } = require("../models");

const getUsers = (req, res, next) => {
  User.find().then(users => {
    res.send({ users });
  });
};

const getUserByUsername = (req, res, next) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) throw { status: 404 };
      res.send({ user });
    })
    .catch(next);
};

module.exports = { getUsers, getUserByUsername };
