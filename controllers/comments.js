const { Comment } = require("../models");

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
  Comment.find({ belongs_to: req.params.article_id })
    .populate("created_by")
    .populate("belongs_to")
    .then(comments => {
      if (comments.length === 0) throw { status: 404 };
      res.send({ comments });
    })
    .catch(next);
};

module.exports = { getComments, getCommentsByArticleId };
