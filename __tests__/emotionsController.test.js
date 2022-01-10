const app = require("../app");
const request = require("supertest");
const POOL = require("../db");

jest.mock("../db");

describe("getEmotions", () => {
  test("getEmotions는 성공하면 Emotion배열을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      { id: 1, name: "기쁨", userId: 1 },
      { id: 2, name: "슬픔", userId: 1 },
      { id: 3, name: "분노", userId: 1 },
    ]);
    const res = await request(app).get("/emotions/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([
      { id: 1, name: "기쁨", userId: 1 },
      { id: 2, name: "슬픔", userId: 1 },
      { id: 3, name: "분노", userId: 1 },
    ]);
  });

  test("getEmotions는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app).get("/emotions/1");
    expect(res.statusCode).toBe(500);
  });
});

describe("postEmotions", () => {
  test("postEmotions는 성공하면 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const res = await request(app)
      .post("/emotions")
      .send({ name: "ㅁㅁㅁㅁ", userId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(10);
  });

  test("postEmotions는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app)
      .post("/emotions")
      .send({ name: "ㅁㅁㅁㅁ", userId: 1 });
    expect(res.statusCode).toBe(500);
  });
});
