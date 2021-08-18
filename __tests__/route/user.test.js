const request = require("supertest");
const app = require("../../index.js");
const mongoose = require("mongoose");

describe("route user", () => {
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
  describe("route /user/sign-up", () => {
    test("shoud create a user", async () => {
      const field = {
        email: "userTest1@gmail.com",
        username: "userTest1",
        password: "azerty",
        description: "create a new user",
      };
      const response = await request(app).post("/user/sign-up").send(field);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("welcome user created");
      expect(response.body.data.token).toBeTruthy();
      expect(response.body.data.email).toBeTruthy();
      //give a token and id for the next  route test
      authToken = response.body.data.token;
      id = response.body.data._id;
    });

    test("shoud response with a error email already use", async () => {
      const field = {
        email: "userTest1@gmail.com",
        username: "userTest1",
        password: "azerty",
        description: "create a new user",
      };
      const response = await request(app).post("/user/sign-up").send(field);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("This email already has an account.");
    });

    test("shoud response a message field missing", async () => {
      const field = {
        email: "usertest2@gmail.com",
        username: "userTest2",
        password: "azerty",
        description: "description",
      };
      for (const key in field) {
        const newField = { ...field };
        newField[key] = "";
        const response = await request(app)
          .post("/user/sign-up")
          .send(newField);
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Missing parameters");
      }
    });
  });
  describe("route /user/update", () => {
    test("shoud update a user", async () => {
      const field = {
        avatar: {
          age: 300,
          hairColor: "black",
          sexe: "female",
          skin: "white",
        },
        account: {
          username: "testUserUpdate1",
          job: "studient",
          phone: "0613660983",
          description: "testUserUpdate1",
        },
      };
      const response = await request(app)
        .put("/user/update")
        .auth(authToken, { type: "bearer" })
        .send(field);
      expect(response.body.message).toBe("user update");
      expect(response.status).toBe(200);
      expect(response.body.data.public.account).toEqual(field.account);
      expect(response.body.data.public.avatar).toEqual(field.avatar);
    });
  });

  describe("route /user/:id", () => {
    test("shoud retourn a user", async () => {
      const response = await request(app).get(`/user/` + id);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        `user ${response.body.data.public.account.username}`
      );
    });
  });
});
