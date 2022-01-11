const app = require("../app");
const request = require("supertest");
const POOL = require("../db");

jest.mock("../db");

describe("getEmoOccurs", () => {
  test("getEmoOccurs는 성공하면 EmoOccur배열을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      {
        date: "2021-12-29T08:39:55.000Z",
        emotionName: "기쁨",
        id: 1,
        userId: 1,
      },
      {
        date: "2021-12-29T08:39:55.000Z",
        emotionName: "슬픔",
        id: 2,
        userId: 1,
      },
    ]);

    const res = await request(app).get("/emooccurrences/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([
      {
        date: "2021-12-29T08:39:55.000Z",
        emotionName: "기쁨",
        id: 1,
        userId: 1,
      },
      {
        date: "2021-12-29T08:39:55.000Z",
        emotionName: "슬픔",
        id: 2,
        userId: 1,
      },
    ]);
  });

  test("getEmoOccurs는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app).get("/emooccurrences/1");
    expect(res.statusCode).toBe(500);
  });
});

describe("postEmoOccurs", () => {
  test("postEmoOccurs는 성공하면 삽입된 활동기록의 아이디를 반환해햐 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "안기쁨", userId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(10);
  });

  test("postEmoOccurs는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "안기쁨", userId: 1 });
    expect(res.statusCode).toBe(500);
  });
});
