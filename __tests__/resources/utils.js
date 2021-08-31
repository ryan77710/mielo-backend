const request = require("supertest");
const app = require("../../src/app");
const mongoose = require("mongoose");
const uid2 = require("uid2");

const createUser = async () => {
  const field = {
    email: uid2(10) + "userTest1@gmail.com",
    username: uid2(10) + "userTest1",
    password: "azerty",
    description: "create a new user",
  };
  const response = await request(app)
    .post("/user/sign-up")
    .send(field)
    .expect(200);
  return response;
};
const createPost = async (authToken) => {
  const postField = {
    type: "text",
    text: "test test 1",
  };
  const response = await request(app)
    .post("/post/publish-text")
    .auth(authToken, { type: "bearer" })
    .send(postField)
    .expect(200);
  return response;
};
const createComment = async (authToken, postId) => {
  const commentField = {
    text: "text comment test 2",
  };
  const response = await request(app)
    .post("/comment/publish/" + postId)
    .auth(authToken, { type: "bearer" })
    .send(commentField);
  return response;
};
module.exports = { createPost, createUser, createComment };
