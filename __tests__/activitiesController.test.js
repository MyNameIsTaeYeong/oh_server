const app = require("../app");
const request = require("supertest");
const POOL = require("../db");

jest.mock("../db");

describe("getActivities", () => {
  test("getActivities는 200코드와 activity배열을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      { id: 1, name: "수면부족", userId: 1 },
      { id: 2, name: "운동", userId: 1 },
      { id: 3, name: "독서", userId: 1 },
      { id: 4, name: "설거지", userId: 1 },
    ]);
    const res = await request(app).get("/activities/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([
      { id: 1, name: "수면부족", userId: 1 },
      { id: 2, name: "운동", userId: 1 },
      { id: 3, name: "독서", userId: 1 },
      { id: 4, name: "설거지", userId: 1 },
    ]);
  });

  test("getActivities는 에러가 발생하면 상태500을 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app).get("/activities/1");

    expect(res.statusCode).toBe(500);
  });
});

describe("postActivities", () => {
  test("활동 생성이 성공하면 200코드와 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(10);
  });

  test("활동 생성이 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId: 1 });
    expect(res.statusCode).toBe(500);
  });
});
