const request = require("supertest");
const app = require("../../src/app");
const mongoose = require("mongoose");
const uid2 = require("uid2");
const createUser = require("../resources/utils").createUser;
const createPost = require("../resources/utils").createPost;
const createComment = require("../resources/utils").createComment;

describe("route comment", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("route /comment/publish/:id", () => {
    test("1/comment| should create a comment", async () => {
      const responseUser = await createUser();

      const authToken = responseUser.body.data.token;
      const responsePost = await createPost(authToken);
      const postId = responsePost.body.data._id;

      const responseTested = await createComment(authToken, postId);
      expect(responseTested.status).toBe(200);
      expect(responseTested.body.message).toBe("comment added");
    });

    test("2/comment| should response with status 400 missing parameter", async () => {
      const responseUser = await createUser();
      const authToken = responseUser.body.data.token;

      const responsePost = await createPost(authToken);
      const postId = responsePost.body.data._id;

      const response1 = await request(app)
        .post("/comment/publish/" + postId)
        .auth(authToken, { type: "bearer" })
        .send({})
        .expect(400);
      expect(response1.body.message).toBe("missing post id or text comment");

      const response2 = await request(app)
        .post("/comment/publish/")
        .auth(authToken, { type: "bearer" })
        .send({
          text: "text comment test 2",
        })
        .expect(404);
      expect(response2.text).toBe("request not found");
    });
  });

  describe("route /comment/update/:id", () => {
    test("3/comment| should update a comment", async () => {
      const responseUser = await createUser();
      const authToken = responseUser.body.data.token;

      const responsePost = await createPost(authToken);

      const postId = responsePost.body.data._id;

      const responseComment = await createComment(authToken, postId);

      const commentId = responseComment.body.data._id;

      const commentFieldToUpdate = {
        text: "update haha",
      };

      const responseTested = await request(app)
        .post("/comment/update/" + commentId)
        .auth(authToken, { type: "bearer" })
        .send(commentFieldToUpdate);
      expect(responseTested.status).toBe(200);
      expect(responseTested.body.message).toBe("comment update");
      expect(responseTested.body.data.commentText).toBe(
        commentFieldToUpdate.text
      );
    });
  });
  describe("route /comment/delete/:id", () => {
    test("4/comment| should delete a comment", async () => {
      const responseUser = await createUser();
      const authToken = responseUser.body.data.token;

      const responsePost = await createPost(authToken);
      const postId = responsePost.body.data._id;

      const responseComment = await createComment(authToken, postId);

      const commentId = responseComment.body.data._id;
      const responseTested = await request(app)
        .get("/comment/delete/" + commentId)
        .auth(authToken, { type: "bearer" });

      expect(responseTested.status).toBe(200);
      expect(responseTested.body.message).toBe("comment deleted");
    });
  });

  describe("route : /comment/read-all/:id", () => {
    test("5/comment| should response 200 and read all comment", async () => {
      const responseUser = await createUser();
      const authToken = responseUser.body.data.token;
      const userId = responseUser.body.data._id;

      const responsePost = await createPost(authToken);
      const postId = responsePost.body.data._id;
      const commentField = {
        text: uid2(8) + "text comment test 2",
      };
      for (let i = 0; i < 5; i++) {
        const responseComment = await request(app)
          .post("/comment/publish/" + postId)
          .auth(authToken, { type: "bearer" })
          .send(commentField)
          .expect(200);
      }
      const responseTested = await request(app)
        .post("/comment/read-all/" + userId)
        .expect(200);
      expect(responseTested.body.message).toBe("user comments");
      expect(responseTested.body.data.length).toBe(5);
    });
    test("6/comment| shoud return no comment found", async () => {
      const responseUser = await createUser();
      const userId = responseUser.body.data._id;

      const responseTested = await request(app)
        .post("/comment/read-all/" + userId)
        .expect(200);
      expect(responseTested.body.message).toBe("neither comment found");
    });
  });
});
