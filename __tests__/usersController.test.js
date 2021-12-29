const request = require("supertest");
const app = require("../app");
const queries = require("../controllers/queries");

jest.mock("../controllers/queries");

// [ RowDataPacket { id: 1, email: 'imtaebari@gmail.com' } ]
describe("getUsers", () => {
  test("정상인 경우", async () => {
    queries.selectUsers.mockReturnValue([
      { id: 1, email: "imtaebari@gmail.com" },
    ]);
    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("imtaebari@gmail.com");
  });
});
