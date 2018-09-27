const { Article } = require("../models");

const getArticles = (req, res, next) => {
  Article.find()
    .populate("created_by")
    .then(articles => res.send({ articles }))
    .catch(next);
};

const getArticleById = (req, res, next) => {
  Article.findById(req.params.article_id)
    .populate("created_by")
    .then(article => {
      if (!article) throw { status: 404 };
      res.send({ article });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.slug }).then(articles => {
    res.send({ articles });
  });
};

module.exports = {
  getArticles,
  getArticleById,
  getArticlesByTopic
};
