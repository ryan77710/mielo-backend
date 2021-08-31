const request = require("supertest");
const app = require("../../src/app");
const mongoose = require("mongoose");
const uid2 = require("uid2");
const createUser = require("../resources/utils").createUser;

describe("route report", () => {
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
  describe("route : /report/publish", () => {
    test("should return res 200 create a report", async () => {});
  });
});
