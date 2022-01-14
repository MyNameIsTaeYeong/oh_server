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

describe("postEmoAndAct", () => {
  test("postEmoAndAct는 성공하면 200코드와 연관된 감정과 활동의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([{ 달리기: 3 }, { 숙면: 2 }]);
    const res = await request(app)
      .post("/EmoOccurrences/{userId}/ActOccurrences")
      .send({ emotionName: "안기쁨" });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual([
      [{ 달리기: 3 }, { 숙면: 2 }],
      [{ 달리기: 3 }, { 숙면: 2 }],
    ]);
  });

  test("postEmoAndAct는 실패하면 500코드를 리턴해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error();
    });
    const res = await request(app)
      .post("/EmoOccurrences/{userId}/ActOccurrences")
      .send({ emotionName: "안기쁨" });
    expect(res.status).toBe(500);
  });
});
