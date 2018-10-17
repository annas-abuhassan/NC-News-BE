const { Article, Comment, Topic } = require("../models");
const { formatArticlesWithCommentCount, checkDoc } = require("../utils");

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
    Comment.count({ belongs_to: req.params.article_id })
  ])
    .then(([articleDoc, commentCount]) => {
      checkDoc(articleDoc);
      const article = {
        ...articleDoc,
        comment_count: commentCount
      };
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

  Topic.find({ slug: req.params.slug }).then(topicDoc => {
    if (!topicDoc.length) {
      console.log("adding the topic!");
      Topic.create({ title: req.params.slug, slug: req.params.slug });
    } else {
      console.log("topic already exists");
    }
  });

  Article.create({ ...req.body, belongs_to: req.params.slug })
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
  const voteInc =
    req.query.votes === "up" ? 1 : req.query.votes === "down" ? -1 : 0;
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
