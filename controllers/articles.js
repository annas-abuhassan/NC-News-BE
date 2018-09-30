const { Article, Comment } = require("../models");
const { formatArticlesWithCommentCount, checkId } = require("../utils");

const getArticles = (req, res, next) => {
  Article.find()
    .populate("created_by")
    .lean()
    .then(articleDocs => {
      return Promise.all([articleDocs, Comment.find()]);
    })
    .then(([articleDocs, commentDocs]) => {
      const articles = formatArticlesWithCommentCount(articleDocs, commentDocs);
      res.send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  return Promise.all([
    Article.findById(req.params.article_id)
      .populate("created_by")
      .lean(),
    Comment.find({ belongs_to: req.params.article_id })
  ])
    .then(([articleDoc, commentDoc]) => {
      checkId(articleDoc);
      const article = formatArticlesWithCommentCount(
        [articleDoc],
        commentDoc
      )[0];
      res.send({ article });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.slug })
    .populate("created_by")
    .lean()
    .then(articleDocs => {
      return Promise.all([articleDocs, Comment.find()]);
    })
    .then(([articleDocs, commentDocs]) => {
      const articles = formatArticlesWithCommentCount(articleDocs, commentDocs);
      res.send({ articles });
    })
    .catch(next);
};

const addArticleByTopic = (req, res, next) => {
  req.body.belongs_to = req.params.slug;
  Article.create(req.body)
    .then(articleDoc => {
      const article = {
        ...articleDoc._doc,
        comment_count: 0
      };
      res.status(201).send({ article });
    })
    .catch(next);
};

const makeArticleVote = (req, res, next) => {
  voteInc = req.query.votes === "up" ? 1 : req.query.votes === "down" ? -1 : 0;
  Article.findByIdAndUpdate(
    { _id: req.params.article_id },
    {
      $inc: { votes: voteInc }
    },
    { new: true }
  )
    .then(article => {
      checkId(article);
      res.send({ article });
    })
    .catch(next);
};

module.exports = {
  getArticles,
  getArticleById,
  getArticlesByTopic,
  addArticleByTopic,
  makeArticleVote
};
