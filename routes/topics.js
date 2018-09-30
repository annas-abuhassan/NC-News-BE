const topicRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");
const {
  getArticlesByTopic,
  addArticleByTopic
} = require("../controllers/articles");

topicRouter.get("/", getTopics);
topicRouter
  .get("/:slug/articles", getArticlesByTopic)
  .post("/:slug/articles", addArticleByTopic);

module.exports = topicRouter;
