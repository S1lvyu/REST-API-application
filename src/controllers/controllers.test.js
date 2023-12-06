const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
require("dotenv").config();

describe("Login Controller", () => {
  beforeAll(async () => {
    const URL_DB = process.env.DB_URL;
    mongoose.connect(URL_DB);
  });
  test("Should return status code 200 and a token", async () => {
    const response = await request(app)
      .post("/api/contacts/users/login")
      .send({ email: "Silvian253.eugen@gmail.com", password: "test1235" });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("token");
  });

  test("Should return an object with email and subscription as strings", async () => {
    const response = await request(app)
      .post("/api/contacts/users/login")
      .send({ email: "Silvian253.eugen@gmail.com", password: "test1235" });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.user.email).toEqual(expect.any(String));
    expect(response.body.data.user.subscription).toEqual(expect.any(String));
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
});
