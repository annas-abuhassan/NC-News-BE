const mongoose = require("mongoose");
const { Topic, User, Article, Comment } = require("../models");
const { formatArticles, formatComments } = require("../utils");
const seedDB = (topicData, userData, articleData, commentData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topicDoc, userDoc]) => {
      return Promise.all([
        topicDoc,
        userDoc,
        Article.insertMany(formatArticles(userDoc, articleData))
      ]);
    })
    .then(([topicDoc, userDoc, articleDoc]) => {
      return Promise.all([
        topicDoc,
        userDoc,
        articleDoc,
        Comment.insertMany(formatComments(userDoc, articleDoc, commentData))
      ]);
    });
};

module.exports = seedDB;
