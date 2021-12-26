const request = require("supertest");

const app = require("../app.js");

// jest.useFakeTimers();

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const res = await request(app).get("/users/1");
    console.log(res.text);
    return expect(res.statusCode).toBe(200);
  });
});
