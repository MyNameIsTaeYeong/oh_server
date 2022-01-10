const request = require("supertest");
const app = require("../app");
const POOL = require("../db");

jest.mock("../db");

// [ RowDataPacket { id: 1, email: 'imtaebari@gmail.com' } ]
describe("getUsers", () => {
  test("getUsers는 성공하면 유저의 이메일을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([{ id: 1, email: "imtaebari@gmail.com" }]);
    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("imtaebari@gmail.com");
  });

  test("getUsers는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(500);
  });
});
