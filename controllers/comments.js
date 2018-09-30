const { Comment, Article } = require("../models");
const { checkId } = require("../utils");

const getComments = (req, res, next) => {
  Comment.find()
    .populate("created_by")
    .populate("belongs_to")
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  Article.findById(req.params.article_id)
    .then(article => {
      checkId(article);
    })
    .then(() =>
      Comment.find({ belongs_to: req.params.article_id })
        .populate("created_by")
        .populate("belongs_to")
    )
    .then(comments => {
      if (comments.length === 0)
        throw { status: 404, msg: "No comments for this article" };
      res.send({ comments });
    })
    .catch(next);
};

const addCommentByArticleId = (req, res, next) => {
  req.body.belongs_to = req.params.article_id;
  Article.findById(req.params.article_id)
    .then(article => {
      checkId(article);
    })
    .then(() => Comment.create(req.body))
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const makeCommentVote = (req, res, next) => {
  voteInc = req.query.votes === "up" ? 1 : req.query.votes === "down" ? -1 : 0;
  Comment.findByIdAndUpdate(
    { _id: req.params.comment_id },
    {
      $inc: { votes: voteInc }
    },
    { new: true }
  )
    .then(comment => {
      checkId(comment);
      res.send({ comment });
    })
    .catch(next);
};

const deleteCommentById = (req, res, next) => {
  Comment.findByIdAndRemove({ _id: req.params.comment_id })
    .then(comment => {
      checkId(comment);
      res.send({ comment });
    })
    .catch(next);
};
module.exports = {
  getComments,
  getCommentsByArticleId,
  addCommentByArticleId,
  makeCommentVote,
  deleteCommentById
};