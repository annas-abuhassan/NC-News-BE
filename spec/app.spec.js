process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const { password } = require('../config');
const app = require('../app');
const request = require('supertest')(app);
const mongoose = require('mongoose');
const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../seed/testData');
const seedDB = require('../seed/seed');

describe('/api', () => {
  beforeEach(() =>
    seedDB(topicData, userData, articleData, commentData).then(data => {
      [topicDoc, userDoc, articleDoc, commentDoc] = data;
    })
  );
  after(() => mongoose.disconnect());

  describe('/topics', () => {
    it('GET responds with status code 200 and an array of topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an('array');
          expect(topics).to.have.length(2);
          expect(topics[0]).to.have.keys('_id', 'title', 'slug', '__v');
        });
    });
    describe('/:slug', () => {
      it('GET responds with status code 200 and an array of articles with a specific topic', () => {
        return request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an('array');
            expect(articles).to.have.length(2);
            expect(articles[0]).to.have.keys(
              'votes',
              'title',
              'created_by',
              'created_at',
              'body',
              'belongs_to',
              '_id',
              '__v',
              'comment_count'
            );
            expect(articles[0].comment_count).to.equal(2);
          });
      });
      describe('/articles', () => {
        it('POST responds with status code 201 and the added article for a specific topic', () => {
          const newArticle = {
            title: 'hello i am a new article',
            created_by: '5bacb626c997a64582c568e9',
            body: 'hello article, nice to meet you'
          };
          return request
            .post('/api/topics/cats/articles')
            .send(newArticle)
            .expect(201)
            .then(({ body: { article } }) => {
              expect(article.belongs_to).to.equal('cats');
              expect(article.comment_count).to.equal(0);
            });
        });
        it('POST responds with status code 400 if the posted article object is missing keys', () => {
          const badArticle = {
            title: 'hello i am a new article',
            body: 'hello article, nice to meet you'
          };
          return request
            .post('/api/topics/cats/articles')
            .send(badArticle)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request');
            });
        });
      });
    });
  });
  describe('/articles', () => {
    it('GET responds with status code 200 and an array of articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an('array');
          expect(articles).to.have.length(4);
          expect(articles[0].title).to.equal(articleDoc[0].title);
          expect(articles[0].comment_count).to.equal(2);
        });
    });
    describe('/:article_id', () => {
      it('GET responds with status code 200 and an article corresponding to the article_id parameter', () => {
        return request
          .get(`/api/articles/${articleDoc[0]._id}`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article._id).to.be.equal(`${articleDoc[0]._id}`);
            expect(article.comment_count).to.equal(2);
          });
      });
      it('GET responds with status code 400 for an invalid article id', () => {
        return request
          .get(`/api/articles/annas`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request');
          });
      });
      it('GET responds with status code 404 for an article id that does not exist', () => {
        return request
          .get(`/api/articles/5bacc325b0225a56cbd5daa1`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('ID does not exist');
          });
      });
      it("PATCH returns with status code 200 and an article with an increased vote count when the request query = 'up'", () => {
        return request
          .patch(`/api/articles/${articleDoc[0]._id}?votes=up`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(articleDoc[0].votes + 1);
          });
      });
      it("PATCH returns with status code 200 and an article with a decreased vote count when the request query = 'down'", () => {
        return request
          .patch(`/api/articles/${articleDoc[0]._id}?votes=down`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(articleDoc[0].votes - 1);
          });
      });
      it("PATCH returns with status code 200 and an article with the original vote count when the request query does not equal 'up' or 'down'", () => {
        return request
          .patch(`/api/articles/${articleDoc[0]._id}?votes=apples`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(articleDoc[0].votes);
          });
      });
      it('PATCH returns with status code 400 for an invalid article id', () => {
        return request
          .patch(`/api/articles/bazooka?votes=up`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.be.equal('Bad request');
          });
      });
      it('PATCH returns with status code 404 for an article id that does not exist', () => {
        return request
          .patch(`/api/articles/5bacc325b0223a56cbd5daa1?votes=up`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.be.equal('ID does not exist');
          });
      });
      describe('/comments', () => {
        it('GET responds with status code 200 and an array of comments for a particular article id', () => {
          return request
            .get(`/api/articles/${articleDoc[0]._id}/comments`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.an('array');
              expect(comments).to.have.length(2);
              expect(comments[0]).to.have.keys(
                '_id',
                'belongs_to',
                'body',
                'created_at',
                'created_by',
                'votes',
                '__v'
              );
              expect(comments[0].votes).to.equal(commentDoc[0].votes);
            });
        });
        it('GET returns a 400 for an invalid article id', () => {
          return request
            .get(`/api/articles/annas/comments`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request');
            });
        });
        it('GET returns a 404 for an article id that does not exist', () => {
          return request
            .get(`/api/articles/5bacc325b0225a56cbd5daa1/comments`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('ID does not exist');
            });
        });
      });
      describe('/comments', () => {
        it('POST responds with status code 201 and the added comment for a specific article id', () => {
          const newComment = {
            created_by: `${articleDoc[0]._id}`,
            body: 'This is a new comment!'
          };
          return request
            .post(`/api/articles/${articleDoc[0]._id}/comments`)
            .send(newComment)
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment.belongs_to).to.equal(`${articleDoc[0]._id}`);
            });
        });
        it('POST responds with status code 400 for a comment which is missing keys', () => {
          const badComment = {
            created_by: `${articleDoc[0]._id}`
          };
          return request
            .post(`/api/articles/${articleDoc[0]._id}/comments`)
            .send(badComment)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request');
            });
        });
        it('POST returns a 400 for an invalid article id', () => {
          const newComment = {
            created_by: `${articleDoc[0]._id}`,
            body: 'This is a new comment!'
          };
          return request
            .post(`/api/articles/annas/comments`)
            .send(newComment)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('Bad request');
            });
        });
        it('POST responds with status code 404 for an article id that does not exist', () => {
          const newComment = {
            created_by: `${articleDoc[0]._id}`,
            body: 'This is a new comment!'
          };
          return request
            .post(`/api/articles/5bacc325b0225a56cbd6daa1/comments`)
            .send(newComment)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('ID does not exist');
            });
        });
      });
    });
  });
  describe('/comments', () => {
    it('GET responds with status code 200 and an array of comments', () => {
      return request
        .get(`/api/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.an('array');
          expect(comments).to.have.length(8);
          expect(comments[0].votes).to.equal(commentDoc[0].votes);
        });
    });
    describe('/:comment_id', () => {
      it("PATCH returns with status code 200 and a comment with an increased vote count when the request query = 'up'", () => {
        return request
          .patch(`/api/comments/${commentDoc[0]._id}?votes=up`)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(commentDoc[0].votes + 1);
          });
      });
      it("PATCH returns with status code 200 and a comment with a decreased vote count when the request query = 'down'", () => {
        return request
          .patch(`/api/comments/${commentDoc[0]._id}?votes=down`)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(commentDoc[0].votes - 1);
          });
      });
      it("PATCH returns with status code 200 and a comment with the original vote count when the request query does not equal 'up' or 'down'", () => {
        return request
          .patch(`/api/comments/${commentDoc[0]._id}?votes=apples`)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(commentDoc[0].votes);
          });
      });
      it('PATCH returns with status code 400 for an invalid comment', () => {
        return request
          .patch(`/api/comments/annas?votes=up`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request');
          });
      });
      it('PATCH returns with status code 404 for a comment id that does not exist', () => {
        return request
          .patch(`/api/comments/5bacc325b0223a56cbd5daa1?votes=up`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('ID does not exist');
          });
      });
      it('DELETE returns with status code 200 and returns the deleted comment', () => {
        return request
          .delete(`/api/comments/${commentDoc[0]._id}`)
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment._id).to.equal(`${commentDoc[0]._id}`);
          })
          .then(() => {
            return request.get(`/api/comments`).expect(200);
          })
          .then(({ body: { comments } }) => {
            expect(comments[0]._id).to.equal(`${commentDoc[1]._id}`);
          });
      });
      it('DELETE returns with status code 400 for an invalid comment id', () => {
        return request
          .delete(`/api/comments/annas`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request');
          });
      });
      it('DELETE returns with status code 404 for a comment id that does not exist', () => {
        return request
          .delete(`/api/comments/5bacc325b0223a56cbd5daa1`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('ID does not exist');
          });
      });
    });
  });
  describe('/users', () => {
    it('GET responds with status code 200 and an array of users', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).to.be.an('array');
          expect(users).to.have.length(2);
          expect(users[0]).to.have.keys(
            '_id',
            'username',
            'name',
            'avatar_url',
            '__v'
          );
          expect(users[0].name).to.equal(userDoc[0].name);
        });
    });
    describe('/:_id', () => {
      it('GET responds with status code 200 and a specific user for a given user ID', () => {
        return request
          .get(`/api/users/${userDoc[0]._id}`)
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.have.keys(
              '_id',
              'username',
              'name',
              'avatar_url',
              'articles',
              'comments',
              '__v'
            );
            expect(user._id).to.equal(`${userDoc[0]._id}`);
          });
      });
      it('GET returns a 404 for an ID that does not exist', () => {
        return request
          .get(`/api/users/5bacc325b0223a56cbd5daa1`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('ID does not exist');
          });
      });
      it('GET returns a 400 for an invalid ID', () => {
        return request
          .get(`/api/users/lara`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('Bad request');
          });
      });
    });
  });
  describe('/logger', () => {
    it('GET returns with status code 200 and the current logging level', () => {
      return request
        .get('/api/logger')
        .expect(200)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('The current log level is debug');
        });
    });
    it('PATCH returns with status code 200 and the new logging level', () => {
      const newLevel = 'error';
      return request
        .patch(`/api/logger?level=${newLevel}&password=${password}`)
        .expect(200)
        .then(({ body: { msg, level } }) => {
          expect(level).to.equal(newLevel);
          expect(msg).to.equal(
            `Previous log level: debug. Log level now set to: ${level}`
          );
        });
    });
    it('PATCH returns with status code 400 and an appropriate error message when the password is incorrect', () => {
      const goodLevel = 'error';
      const badPass = 'iamwrong';
      return request
        .patch(`/api/logger?level=${goodLevel}&password=${badPass}`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(
            'Incorrect password. Please contact your admin for this information.'
          );
        });
    });
    it('PATCH returns with status code 400 and an appropriate error message when the logging level is invalid', () => {
      const badLevel = 'verbose';
      return request
        .patch(`/api/logger?level=${badLevel}&password=${password}`)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal(
            `${badLevel} is not a valid logging level. Please select either 'debug' or 'error`
          );
        });
    });
  });
});
