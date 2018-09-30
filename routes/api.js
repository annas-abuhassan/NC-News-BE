const apiRouter = require("express").Router();
const topicRouter = require("./topics");
const commentRouter = require("./comments");
const userRouter = require("./users");
const articleRouter = require("./articles");

apiRouter.get("/", function(req, res) {
  res.render("index");
});
apiRouter.use("/topics", topicRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
