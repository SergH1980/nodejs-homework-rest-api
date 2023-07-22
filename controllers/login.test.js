require("dotenv").config();

const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { User } = require("../models/user");

mongoose.set("strictQuery", false);

const { DB_TEST_URI, PORT } = process.env;

let server = null;
const userData = {
  email: "test@info.com",
  password: "123123",
};
// const subscription = "starter";

describe("login", () => {
  beforeAll(async () => {
    server = app.listen(PORT);
    await mongoose.connect(DB_TEST_URI);
  });
  afterAll(async () => {
    server.close();
    await mongoose.disconnect(DB_TEST_URI);
  });
  beforeEach(async () => {
    await User.deleteMany();
    await supertest(app).post(`/api/users/register`).send(userData);
  });

  // status code should be 201
  test("status code", async () => {
    const { statusCode } = await supertest(app)
      .post(`/api/users/login`)
      .send(userData);
    expect(statusCode).toBe(200);
  });

  // user's token to be received in body

  test("sends user's token", async () => {
    const { body } = await supertest(app)
      .post(`/api/users/login`)
      .send(userData);
    const user = await User.findOne({ email: userData.email });
    expect(body.token).toBe(user.token);
  });

  // user.email and user.subscription are strings
  test("email and subscription are strings", async () => {
    const { body } = await supertest(app)
      .post(`/api/users/login`)
      .send(userData);
    expect(typeof body.user.email && typeof body.user.subscription).toBe(
      "string"
    );
  });

  // user.subscription to be one of the following: "starter", "pro", "business"
  test("type of subscription", async () => {
    const { body } = await supertest(app)
      .post(`/api/users/login`)
      .send(userData);
    expect(body.user.subscription).toBe("starter" || "pro" || "business");
  });
});
