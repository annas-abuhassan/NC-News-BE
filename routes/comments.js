const commentRouter = require("express").Router();
const { getComments } = require("../controllers/comments");

commentRouter.get("/", getComments);

module.exports = commentRouter;
