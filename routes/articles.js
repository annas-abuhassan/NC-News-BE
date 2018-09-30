const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  makeArticleVote
} = require("../controllers/articles");
const {
  getCommentsByArticleId,
  addCommentByArticleId
} = require("../controllers/comments");

articleRouter.get("/", getArticles);
articleRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(makeArticleVote);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(addCommentByArticleId);

module.exports = articleRouter;
