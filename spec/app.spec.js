process.env.NODE_ENV = "test";
const { expect } = require("chai");
const app = require("../app");
const request = require("supertest")(app);
const mongoose = require("mongoose");
const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../seed/testData");
const seedDB = require("../seed/seed");

describe("/api", () => {
  beforeEach(() =>
    seedDB(topicData, userData, articleData, commentData).then(data => {
      [topicDoc, userDoc, articleDoc, commentDoc] = data;
    }));
  after(() => mongoose.disconnect());

  describe("/topics", () => {
    it("GET responds with status code 200 and an array of topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
          expect(topics).to.have.length(2);
          expect(topics[0]).to.be.an("object");
        });
    });
    describe("/:slug", () => {
      it("GET responds with status code 200 and an array of articles with a specific topic", () => {
        return request
          .get("/api/topics/cats/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles).to.have.length(2);
            expect(articles[0]).to.be.an("object");
          });
      });
    });
  });
  describe("/articles", () => {
    it("GET responds with status code 200 and an array of articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).to.be.an("array");
          expect(articles).to.have.length(4);
          expect(articles[0]).to.have.keys(
            "votes",
            "title",
            "created_by",
            "created_at",
            "body",
            "belongs_to",
            "_id",
            "__v"
          );
          expect(articles[0].title).to.eql(articleDoc[0].title);
        });
    });
    describe("/:article_id", () => {
      it("GET responds with status code 200 an article corresponding to the article_id parameter", () => {
        return request
          .get(`/api/articles/${articleDoc[0]._id}`)
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article._id).to.be.eql(`${articleDoc[0]._id}`);
          });
      });
      it("GET returns a 400 for an invalid id", () => {
        return request
          .get(`/api/articles/annas`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.be.equal("Bad request");
          });
      });
      it("GET returns a 404 for an id that does not exist", () => {
        return request
          .get(`/api/articles/5bacc325b0225a56cbd5daa1`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.be.equal("Not found");
          });
      });
      describe("/comments", () => {
        it("GET responds with status code 200 and an array of comments for a particular article id", () => {
          return request
            .get(`/api/articles/${articleDoc[0]._id}/comments`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.an("array");
              expect(comments).to.have.length(2);
              expect(comments[0]).to.have.keys(
                "_id",
                "belongs_to",
                "body",
                "created_at",
                "created_by",
                "votes",
                "__v"
              );
              expect(comments[0].votes).to.equal(7);
            });
        });
        it("GET returns a 400 for an invalid id", () => {
          return request
            .get(`/api/articles/annas/comments`)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.be.equal("Bad request");
            });
        });
        it("GET returns a 404 for an id that does not exist", () => {
          return request
            .get(`/api/articles/5bacc325b0225a56cbd5daa1/comments`)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.be.equal("Not found");
            });
        });
      });
    });
  });
  describe("/comments", () => {
    it("GET responds with status code 200 and an array of comments", () => {
      return request
        .get(`/api/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.an("array");
          expect(comments).to.have.length(8);
          expect(comments[0]).to.have.keys(
            "_id",
            "belongs_to",
            "body",
            "created_at",
            "created_by",
            "votes",
            "__v"
          );
          expect(comments[0].votes).to.equal(7);
        });
    });
  });
  describe("/users", () => {
    it("GET /users responds with status code 200 and an array of users", () => {
      return request
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).to.be.an("array");
          expect(users).to.have.length(2);
          expect(users[0]).to.be.an("object");
          expect(users[0]).to.have.keys(
            "_id",
            "username",
            "name",
            "avatar_url",
            "__v"
          );
          expect(users[0].name).to.equal("jonny");
        });
    });
    describe("/:username", () => {
      it("GET responds with status code 200 and a specific user", () => {
        return request
          .get(`/api/users/${userDoc[0].username}`)
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user._id).to.equal(`${userDoc[0]._id}`);
          });
      });
      it("GET returns a 404 for a username that does not exist", () => {
        return request
          .get(`/api/users/lara`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.be.equal("Not found");
          });
      });
    });
  });
});
