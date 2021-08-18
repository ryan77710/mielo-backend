const request = require("supertest");
const app = require("../../index.js");
const mongoose = require("mongoose");

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
  let authToken;
  let id;
  let postId;
  let commentId;
  let postIdToDelete;

  // const userCommentTest = {
  //   email: "commentTest0@gmail.com",
  //   username: "commentTest0",
  //   password: "azerty",
  //   description: "create a new user",
  // };
  // const userPost = {
  //   type: "text",
  //   text: "test test 1",
  // };
  // const userPostToDelete = {
  //   type: "text",
  //   text: "test test to delete ",
  // };
  // const fg = async () => {
  //   const res = await request(app).post("/user/sign-up").send(userCommentTest);

  //   authToken = res.body.data.token;
  //   id = res.body.data._id;

  //   const postRes = await request(app)
  //     .post("/post/publish-text")
  //     .auth(authToken, { type: "bearer" })
  //     .send(userPost);
  //   postId = postRes.body.data._id;

  //   const postResToDelete = await request(app)
  //     .post("/post/publish-text")
  //     .auth(authToken, { type: "bearer" })
  //     .send(userPostToDelete);
  //   postIdToDelete = postResToDelete.body.data._id;
  // };
  // fg();
  // const res = await request(app).post("/user/sign-up").send(userCommentTest);

  // authToken = res.body.data.token;
  // id = res.body.data._id;

  // const postRes = await request(app)
  //   .post("/post/publish-text")
  //   .auth(authToken, { type: "bearer" })
  //   .send(userPost);
  // postId = postRes.body.data._id;

  // const postResToDelete = await request(app)
  //   .post("/post/publish-text")
  //   .auth(authToken, { type: "bearer" })
  //   .send(userPostToDelete);
  // postIdToDelete = postResToDelete.body.data._id;

  test("create a user and post for all comment test", async () => {
    const userCommentTest = {
      email: "commentTest0@gmail.com",
      username: "commentTest0",
      password: "azerty",
      description: "create a new user",
    };
    const userPost = {
      type: "text",
      text: "test test 1",
    };
    const userPostToDelete = {
      type: "text",
      text: "test test to delete ",
    };
    const res = await request(app).post("/user/sign-up").send(userCommentTest);
    authToken = res.body.data.token;
    id = res.body.data._id;
    const postRes = await request(app)
      .post("/post/publish-text")
      .auth(authToken, { type: "bearer" })
      .send(userPost);
    postId = postRes.body.data._id;
    const postResToDelete = await request(app)
      .post("/post/publish-text")
      .auth(authToken, { type: "bearer" })
      .send(userPostToDelete);
    postIdToDelete = postResToDelete.body.data._id;
  });

  describe("route /comment/publish/:id", () => {
    test("shoud create a comment", async () => {
      const field = {
        text: "text comment test 2",
      };
      const response = await request(app)
        .post("/comment/publish/" + postId)
        .auth(authToken, { type: "bearer" })
        .send(field);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("comment added");
      expect(response.body.data.commentText).toBe(field.text);
      commentId = response.body.data._id;
    });

    test("shoud response with status 400 missing parameter", async () => {
      const response1 = await request(app)
        .post("/comment/publish/" + postId)
        .auth(authToken, { type: "bearer" })
        .send({});
      expect(response1.status).toBe(400);
      expect(response1.body.message).toBe("missing post id or text comment");

      const response2 = await request(app)
        .post("/comment/publish/")
        .auth(authToken, { type: "bearer" })
        .send({
          text: "text comment test 2",
        });
      expect(response2.status).toBe(404);
    });
  });

  describe("route /comment/update/:id", () => {
    test("shoud update a comment", async () => {
      const field = {
        text: "update haha",
      };

      const response = await request(app)
        .post("/comment/update/" + commentId)
        .auth(authToken, { type: "bearer" })
        .send(field);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("comment update");
      expect(response.body.data.commentText).toBe(field.text);
    });
  });
  describe("route /comment/delete/:id", () => {
    test("shoud delete a comment", async () => {
      const commentToDelete = await request(app)
        .post("/comment/publish/" + postIdToDelete)
        .auth(authToken, { type: "bearer" })
        .send({
          text: "comment to delete 2",
        });
      expect(commentToDelete.status).toBe(200);
      const commentIdToDelete = commentToDelete.body.data._id;
      const response = await request(app)
        .get("/comment/delete/" + commentIdToDelete)
        .auth(authToken, { type: "bearer" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("comment deleted");
    });
  });
});
