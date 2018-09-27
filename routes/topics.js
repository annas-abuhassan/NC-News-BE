const topicRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");
const { getArticlesByTopic } = require("../controllers/articles");

topicRouter.get("/", getTopics);
topicRouter.get("/:slug/articles", getArticlesByTopic);

module.exports = topicRouter;
