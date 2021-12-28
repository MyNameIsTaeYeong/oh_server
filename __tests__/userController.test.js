const request = require("supertest");
const app = require("../app");
const utils = require("../controllers/queries");

jest.mock("../controllers/queries");

// [ RowDataPacket { id: 1, email: 'imtaebari@gmail.com' } ]
describe("getUsers", () => {
  test("정상인 경우", async () => {
    utils.selectByUserId.mockReturnValue([
      { id: 1, email: "imtaebari@gmail.com" },
    ]);
    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("imtaebari@gmail.com");
  });

  test("에러가 발생한 경우", async () => {
    utils.selectByUserId.mockReturnValue(null);
    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(500);
  });
});
