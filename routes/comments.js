const commentRouter = require("express").Router();
const {
  getComments,
  makeCommentVote,
  deleteCommentById
} = require("../controllers/comments");

commentRouter.get("/", getComments);

commentRouter
  .route("/:comment_id")
  .patch(makeCommentVote)
  .delete(deleteCommentById);

module.exports = commentRouter;
