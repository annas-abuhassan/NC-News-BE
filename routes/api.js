const apiRouter = require('express').Router();
const topicRouter = require('./topics');
const commentRouter = require('./comments');
const userRouter = require('./users');
const articleRouter = require('./articles');
const loggerRouter = require('./logger');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/logger', loggerRouter);

module.exports = apiRouter;
