const request = require("supertest");
const app = require("../../src/app");
const mongoose = require("mongoose");
const uid2 = require("uid2");
jest.mock("cloudinary");
const cloudinary = require("cloudinary").v2;
const createUser = require("../resources/utils").createUser;
const mockUploadPicture = require("../resources/mockResponses");

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

  describe("route /user/sign-up", () => {
    test("1/user| should create a user", async () => {
      const response = await createUser();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("welcome user created");
      expect(response.body.data.token).toBeTruthy();
      expect(response.body.data.email).toBeTruthy();
    });

    test("2/user| should response with a error email already use", async () => {
      const field = {
        email: uid2(10) + "userTest1@gmail.com",
        username: uid2(10) + "userTest1",
        password: "azerty",
        description: "create a new user",
      };
      await request(app).post("/user/sign-up").send(field).expect(200);

      const responseTested = await request(app)
        .post("/user/sign-up")
        .send(field)
        .expect(400);
      expect(responseTested.status).toBe(400);
      expect(responseTested.body.message).toBe(
        "This email already has an account."
      );
    });

    test("3/user| should response a message field missing", async () => {
      const field = {
        email: uid2(10) + "usertest2@gmail.com",
        username: uid2(10) + "userTest2",
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
    test("4/user| should update a user", async () => {
      const responseUser = await createUser();

      const authToken = responseUser.body.data.token;
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

      const responseTested = await request(app)
        .put("/user/update")
        .auth(authToken, { type: "bearer" })
        .send(field);

      expect(responseTested.body.message).toBe("user update");
      expect(responseTested.status).toBe(200);
      expect(responseTested.body.data.public.account).toEqual(field.account);
      expect(responseTested.body.data.public.avatar).toEqual(field.avatar);
    });
  });
  describe("route /user/add-profile-picture", () => {
    test("5/user| should add a profile picture", async () => {
      const userResponse = await createUser();

      const authToken = userResponse.body.data.token;

      cloudinary.uploader.upload.mockReturnValueOnce(mockUploadPicture);
      const responseTested = await request(app)
        .post("/user/add-profile-picture")
        .auth(authToken, { type: "bearer" })
        .attach("picture", "__tests__/resources/vetement-zoro-3.jpg");
      expect(responseTested.status).toBe(200);
      expect(responseTested.body.message).toBe("profile picture add");
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(1);
    });

    test("6/user| should return res 400 picture missing", async () => {
      const responseUser = await createUser();

      const authToken = responseUser.body.data.token;
      cloudinary.uploader.upload.mockReturnValueOnce(mockUploadPicture);
      const responseTested = await request(app)
        .post("/user/add-profile-picture")
        .auth(authToken, { type: "bearer" });

      expect(responseTested.status).toBe(400);
      expect(responseTested.body.message).toBe("picture missing");
    });
  });

  describe("route /user/picture-profile-change", () => {
    test("7/user| should change a picture profile", async () => {
      const responseUser = await createUser();

      const authToken = responseUser.body.data.token;
      cloudinary.uploader.destroy.mockReturnValueOnce({
        message: "previous picture delete",
      });
      cloudinary.uploader.upload.mockReturnValueOnce(mockUploadPicture);

      const responseAddPicture = await request(app)
        .post("/user/add-profile-picture")
        .auth(authToken, { type: "bearer" })
        .attach("picture", "__tests__/resources/vetement-zoro-3.jpg")
        .expect(200);
      cloudinary.uploader.upload.mockReturnValueOnce(mockUploadPicture);

      const responseTested = await request(app)
        .post("/user/picture-profile-change")
        .auth(authToken, { type: "bearer" })
        .attach("picture", "__tests__/resources/vetement-zoro-3.jpg");
      expect(responseTested.body.message).toBe("picture update");
    });

    test("8/user| should return res 400 picture missing", async () => {
      const userResponse = await createUser();

      const authToken = userResponse.body.data.token;
      cloudinary.uploader.destroy.mockReturnValueOnce({
        message: "previous picture delete",
      });
      cloudinary.uploader.upload.mockReturnValueOnce(mockUploadPicture);

      const responseAddPicture = await request(app)
        .post("/user/add-profile-picture")
        .auth(authToken, { type: "bearer" })
        .attach("picture", "__tests__/resources/vetement-zoro-3.jpg")
        .expect(200);
      cloudinary.uploader.upload.mockReturnValueOnce(mockUploadPicture);

      const responseTested = await request(app)
        .post("/user/picture-profile-change")
        .auth(authToken, { type: "bearer" })
        .expect(400);

      expect(responseTested.body.message).toBe("missing picture");
    });
  });
  describe("route /user/add-picture", () => {
    test("9/user| should add a picture", async () => {
      const userResponse = await createUser();

      const authToken = userResponse.body.data.token;
      cloudinary.uploader.destroy.mockReturnValueOnce({
        message: "previous picture delete",
      });
      cloudinary.uploader.upload.mockReturnValueOnce(mockUploadPicture);

      const responseTested = await request(app)
        .post("/user/add-picture")
        .auth(authToken, { type: "bearer" })
        .attach("picture", "__tests__/resources/vetement-zoro-3.jpg")
        .expect(200);
      expect(responseTested.body.message).toBe("picture added");
    });
    test("10/user| should return res 400 missing picture", async () => {
      const userResponse = await createUser();

      const authToken = userResponse.body.data.token;

      cloudinary.uploader.upload.mockReturnValueOnce(mockUploadPicture);

      const responseTested = await request(app)
        .post("/user/add-picture")
        .auth(authToken, { type: "bearer" })
        .expect(400);
      expect(responseTested.body.message).toBe("missing picture");
    });
  });
  describe("route / /user/delete-picture", () => {
    test("12/user| should delete a picture", async () => {
      const userResponse = await createUser();
      const authToken = userResponse.body.data.token;
      cloudinary.uploader.destroy.mockReturnValueOnce({
        message: "previous picture delete",
      });

      const responseTested = await request(app)
        .post("/user/delete-picture")
        .auth(authToken, { type: "bearer" })
        .send({
          asset_id: "fb135dd14b317210baa7c135677e9e27",
          public_id:
            "mielo/user/6121c22a9c2048220c1eacde/profile-picture/l0xz4li1kcopsoct3aqx",
        })
        .expect(200);
      expect(responseTested.body.message).toBe("picture deleted");
    });
    test("13/user| should return res 400 public or asset id missing", async () => {
      const userResponse = await createUser();

      const authToken = userResponse.body.data.token;
      cloudinary.uploader.destroy.mockReturnValueOnce({
        message: "previous picture delete",
      });
      const fieldToTest = {
        asset_id: "fb135dd14b317210baa7c135677e9e27",
        public_id:
          "mielo/user/6121c22a9c2048220c1eacde/profile-picture/l0xz4li1kcopsoct3aqx",
      };
      for (const key in fieldToTest) {
        const newField = { ...fieldToTest };
        newField[key] = "";
        const responseTested = await request(app)
          .post("/user/delete-picture")
          .auth(authToken, { type: "bearer" })
          .expect(400);
        expect(responseTested.body.message).toBe(
          "missing public_id or asset_id"
        );
      }
    });
  });
  describe("route /user/:id", () => {
    test("14/user| should return a user", async () => {
      const userResponse = await createUser();

      const id = userResponse.body.data._id;
      const responseTested = await request(app).get(`/user/` + id);
      expect(responseTested.status).toBe(200);
      expect(responseTested.body.message).toBe(
        `user ${responseTested.body.data.public.account.username}`
      );
    });
  });
});
