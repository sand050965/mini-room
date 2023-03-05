const request = require("supertest");
const app = require("../../middleware/app.js");

describe("POST /api/mail", () => {
	describe("successfully send mail", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).post("/api/mail").send({
				senderName: "",
				emailArray: [],
			});
			expect(response.statusCode).toBe(200);
		});
	});
});
