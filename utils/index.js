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
  return (article = articleDocs.map(article => {
    return (article = {
      ...article,
      comment_count: commentDocs.filter(comment => {
        return comment.belongs_to == `${article._id}`;
      }).length
    });
  }));
};

const checkId = id => {
  if (!id) throw { status: 404, msg: "ID does not exist" };
};

module.exports = {
  formatArticles,
  formatComments,
  formatArticlesWithCommentCount,
  checkId
};