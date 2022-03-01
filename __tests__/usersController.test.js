const request = require("supertest");
const app = require("../app");
const POOL = require("../db");
const dotenv = require("dotenv");
const { issueAtoken } = require("../utilities");
dotenv.config();
jest.mock("../db");
jest.mock("../utilities");

// [ RowDataPacket { id: 1, email: 'imtaebari@gmail.com' } ]
describe("getUsers", () => {
  test("getUsers는 성공하면 유저아이디와 accessToken, refreshToken을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([{ id: 1, email: "imtaebari@gmail.com" }]);
    issueAtoken.mockReturnValue("assdqwasdjnj.qdwsqs.qwead");
    const res = await request(app).get("/users/imtaebari@gmail.com");
    expect(res.body).toStrictEqual({
      code: 200,
      id: 1,
      accessToken: "assdqwasdjnj.qdwsqs.qwead",
      refreshToken: "assdqwasdjnj.qdwsqs.qwead",
    });
  });

  test("getUsers는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app).get("/users/1");
    expect(res.statusCode).toBe(500);
  });
});

describe("postUsers", () => {
  test("postUsers는 성공하면 유저아이디와 accessToken, refreshToken을 반환해야 한다.", async () => {
    POOL.TRANSACTION.mockImplementation(() => {
      return {
        QUERY: jest.fn(() => {
          return { insertId: 10 };
        }),
        COMMIT: jest.fn(console.log("postUsers성공 후 commit")),
        VALUES: jest.fn(),
      };
    });
    issueAtoken.mockReturnValue("assdqwasdjnj.qdwsqs.qwead");
    const res = await request(app).post("/users").send({ email: "hahaha" });

    expect(res.body).toStrictEqual({
      code: 200,
      id: 10,
      accessToken: "assdqwasdjnj.qdwsqs.qwead",
      refreshToken: "assdqwasdjnj.qdwsqs.qwead",
    });
  });

  test("postUsers는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.TRANSACTION.mockImplementation(() => {
      return {
        QUERY: jest.fn(() => {
          throw new Error("쿼리 실패");
        }),
        VALUES: jest.fn(),
        ROLLBACK: jest.fn(console.log("postUsers실패 후 rollback")),
      };
    });

    const res = await request(app).post("/users").send({ email: "hahaha" });
    expect(res.statusCode).toBe(500);
  });

  test("등록된 이메일로 postUsers를 호출하면 302코드와 리다이렉트 될 Location을 받는다.", async () => {
    POOL.TRANSACTION.mockImplementation(() => {
      return {
        QUERY: jest.fn(() => Promise.reject({ code: "ER_DUP_ENTRY" })),
        VALUES: jest.fn(),
        ROLLBACK: jest.fn(console.log("등록된 이메일 삽입시도 후 rollback")),
      };
    });

    const res = await request(app).post("/users").send({ email: "hahaha" });
    expect(res.header.location).toBe(`${process.env.SERVER}/users/hahaha`);
    expect(res.statusCode).toBe(302);
  });
});
