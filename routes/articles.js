const articleRouter = require("express").Router();
const { getArticles, getArticleById } = require("../controllers/articles");
const { getCommentsByArticleId } = require("../controllers/comments");

articleRouter.get("/", getArticles);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/:article_id/comments", getCommentsByArticleId);

module.exports = articleRouter;
