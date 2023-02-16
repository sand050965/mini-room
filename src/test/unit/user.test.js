const request = require("supertest");
const app = require("../../middleware/app.js");

describe("PUT /api/user/auth", () => {
  describe("successfully insert user's data into db", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/api/user/auth").send({
        email: "test@gmail.com",
        password: "1234567",
        username: "test",
        avatarImgUrl:
          "https://miniroom.online/d9f8520f-cd21-4f22-a474-918c8ea89c46",
      });
      expect(response.statusCode).toBe(200);
    });
  });
});

describe("POST /api/user/auth", () => {
  describe("given an _id", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).put("/api/user/auth").send({
        email: "test@gmail.com",
        password: "1234567",
      });
      expect(response.statusCode).toBe(200);
    });
  });
});

describe("GET /api/user/auth", () => {
  describe("should respond with a 200 status code", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/api/user").send({
        email: "test@gmail.com",
      });
      expect(response.statusCode).toBe(200);
    });
  });
});

describe("POST /api/user/avatar", () => {
  describe("properly update user's avatar image url", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/api/user/avatar").send({
        email: "test@gmail.com",
        avatarImgUrl: "https://test.com/d9f8520f-cd21-4f22-a474-918c8ea89c46",
      });
      expect(response.statusCode).toBe(200);
    });
  });
});

describe("POST /api/user/name", () => {
  describe("properly update user's name", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/api/user/name").send({
        email: "test@gmail.com",
        username: "testMe",
      });
      expect(response.statusCode).toBe(200);
    });
  });
});
