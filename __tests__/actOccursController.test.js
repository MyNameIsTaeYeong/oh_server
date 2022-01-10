const app = require("../app");
const request = require("supertest");
const POOL = require("../db");

jest.mock("../db");

describe("getActOccurs", () => {
  test("getActOccurs는 성공하면 ActOccur배열을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      {
        id: 1,
        activityName: "운동",
        date: "2021-12-29T08:41:47.000Z",
        userId: 1,
      },
      {
        id: 2,
        activityName: "설거지",
        date: "2021-12-29T08:42:26.000Z",
        userId: 1,
      },
    ]);
    const res = await request(app).get("/actoccurrences/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([
      {
        id: 1,
        activityName: "운동",
        date: "2021-12-29T08:41:47.000Z",
        userId: 1,
      },
      {
        id: 2,
        activityName: "설거지",
        date: "2021-12-29T08:42:26.000Z",
        userId: 1,
      },
    ]);
  });

  test("getActOccurs는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app).get("/actoccurrences/1");
    expect(res.statusCode).toBe(500);
  });
});

describe("postActOccurs", () => {
  test("postActOccurs는 성공하면 삽입된 활동기록의 아이디를 반환해햐 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "달리기", userId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(10);
  });

  test("postActOccurs는 실패하면 500코드를 반환해야한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "달리기", userId: 1 });
    expect(res.statusCode).toBe(500);
  });
});
