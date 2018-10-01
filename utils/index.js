const formatArticles = (userDoc, articleData) => {
  return articleData.map(article => {
    return {
      ...article,
      belongs_to: article.topic,
      created_by: userDoc.find(datum => {
        if (datum.username === article.created_by) return datum;
      })._id
    };
  });
};

const formatComments = (userDoc, articleDoc, commentData) => {
  return commentData.map(comment => {
    return {
      ...comment,
      created_by: userDoc.find(datum => {
        if (datum.username === comment.created_by) return datum;
      })._id,
      belongs_to: articleDoc.find(datum => {
        if (datum.title === comment.belongs_to) return datum;
      })._id
    };
  });
};

const formatArticlesWithCommentCount = (articleDocs, commentDocs) => {
  return articleDocs.map(article => {
    return {
      ...article,
      comment_count: commentDocs.filter(comment => {
        return comment.belongs_to == `${article._id}`;
      }).length
    };
  });
};

const checkDoc = id => {
  if (!id) throw { status: 404, msg: "ID does not exist" };
};

const handle400 = (err, req, res, next) => {
  if (
    err.name === "ValidationError" ||
    err.name === "CastError" ||
    err.name === "Error"
  )
    res.status(400).send({ name: err.name, msg: err.msg || "Bad request" });
  next(err);
};

const handle404 = (err, req, res, next) => {
  if (err.status === 404) res.status(404).send({ msg: err.msg || "Not found" });
  else next(err);
};
const handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = {
  formatArticles,
  formatComments,
  formatArticlesWithCommentCount,
  checkDoc,
  handle400,
  handle404,
  handle500
};
