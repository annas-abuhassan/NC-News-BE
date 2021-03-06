const { Article, Comment, Topic } = require('../models');
const {
  formatArticlesWithCommentCount,
  checkDoc,
  generalLog
} = require('../utils');

const getArticles = (req, res, next) => {
  Article.find()
    .populate('created_by')
    .lean()
    .then(articleDocs => {
      return Promise.all([articleDocs, Comment.find()]);
    })
    .then(([articleDocs, commentDocs]) => {
      const articles = formatArticlesWithCommentCount(articleDocs, commentDocs);
      res.send({ articles });
      generalLog(req, res);
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  return Promise.all([
    Article.findById(req.params.article_id)
      .populate('created_by')
      .lean(),
    Comment.count({ belongs_to: req.params.article_id })
  ])
    .then(([articleDoc, commentCount]) => {
      checkDoc(articleDoc);
      const article = {
        ...articleDoc,
        comment_count: commentCount
      };
      res.send({ article });
      generalLog(req, res);
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.slug })
    .populate('created_by')
    .lean()
    .then(articleDocs => {
      return Promise.all([articleDocs, Comment.find()]);
    })
    .then(([articleDocs, commentDocs]) => {
      const articles = formatArticlesWithCommentCount(articleDocs, commentDocs);
      res.send({ articles });
      generalLog(req, res);
    })
    .catch(next);
};

const addArticleByTopic = (req, res, next) => {
  req.body.belongs_to = req.params.slug;

  Topic.find({ slug: req.params.slug }).then(topicDoc => {
    if (!topicDoc.length) {
      Topic.create({
        title:
          req.params.slug.charAt(0).toUpperCase() + req.params.slug.slice(1),
        slug: req.params.slug
      });
    }
  });

  Article.create({ ...req.body, belongs_to: req.params.slug })
    .then(articleDoc => {
      const article = {
        ...articleDoc._doc,
        comment_count: 0
      };
      res.status(201).send({ article });
      generalLog(req, res, 'body');
    })
    .catch(next);
};

const makeArticleVote = (req, res, next) => {
  const voteInc =
    req.query.votes === 'up' ? 1 : req.query.votes === 'down' ? -1 : 0;
  Article.findByIdAndUpdate(
    { _id: req.params.article_id },
    {
      $inc: { votes: voteInc }
    },
    { new: true }
  )
    .then(article => {
      checkDoc(article);
      res.send({ article });
      generalLog(req, res, 'query');
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
