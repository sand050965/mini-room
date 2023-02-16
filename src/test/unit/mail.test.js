const request = require("supertest");
const app = require("../../middleware/app.js");

// describe("POST /api.mail", () => {
//   describe("given name, email and roomId", () => {
//     // should sned email successfully to receipient
//     // should respond with a json object containing ok
//     // should respond with a 200 status code
//     test("should send the mail and respond with a 200 status code", async () => {
//       const response = await request(app).post("/api/mail").send({
//         name: "me",
//         email: "sand050965@gmail.com",
//         roomLink: "miniroom.online/d9f8520f-cd21-4f22-a474-918c8ea89c46",
//       });
//       expect(response.statusCode).toBe(200);
//     });
//   });
// });
