const app = require("../app");
const request = require("supertest");
const POOL = require("../db");
const { issueAtoken } = require("../utilities");

jest.mock("../db");

describe("getEmoOccurs", () => {
  test("getEmoOccurs는 accessToken을 인증한 사용자에게 EmoOccur배열을 반환해야 한다.", async () => {
    POOL.execute.mockReturnValue([
      [
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
      ],
    ]);
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/emooccurrences/1")
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual([
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

  // test("getEmoOccurs는 refreshToken을 인증한 사용자에게 accessToken과 EmoOccur배열을 반환해야 한다.", async () => {
  //   POOL.QUERY.mockReturnValue([
  //     {
  //       date: "2021-12-29T08:39:55.000Z",
  //       emotionName: "기쁨",
  //       id: 1,
  //       userId: 1,
  //     },
  //     {
  //       date: "2021-12-29T08:39:55.000Z",
  //       emotionName: "슬픔",
  //       id: 2,
  //       userId: 1,
  //     },
  //   ]);
  //   const refreshToken = issueAtoken(1, "refresh", "10s");
  //   const res = await request(app)
  //     .get("/emooccurrences/1")
  //     .set("authorization", refreshToken);

  //   expect(res.status).toBe(200);
  //   expect(res.body.results).toStrictEqual([
  //     {
  //       date: "2021-12-29T08:39:55.000Z",
  //       emotionName: "기쁨",
  //       id: 1,
  //       userId: 1,
  //     },
  //     {
  //       date: "2021-12-29T08:39:55.000Z",
  //       emotionName: "슬픔",
  //       id: 2,
  //       userId: 1,
  //     },
  //   ]);
  //   expect(res.body.accessToken).toBeDefined();
  // });

  test("getEmoOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .get("/emooccurrences/1")
      .set("authorization", accessToken);

    expect(res.body.code).toBe(403);
  });

  test("getEmoOccurs는 조회에 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.execute.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/emooccurrences/1")
      .set("authorization", accessToken);
    expect(res.status).toBe(500);
  });
});

describe("postEmoOccurs", () => {
  test("postEmoOccurs는 accessToken을 인증한 사용자에게 삽입된 감정기록의 아이디를 반환해햐 한다.", async () => {
    POOL.execute.mockReturnValue([{ insertId: 10 }]);
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "안기쁨", userId: 1 })
      .set("authorization", accessToken);
    expect(res.body).toStrictEqual({
      code: 200,
      insertId: 10,
    });
  });

  // test("postEmoOccurs는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 감정기록의 아이디를 반환해햐 한다.", async () => {
  //   POOL.QUERY.mockReturnValue({ insertId: 10 });
  //   const refreshToken = issueAtoken(1, "refresh", "10s");
  //   const res = await request(app)
  //     .post("/emooccurrences")
  //     .send({ emotionName: "안기쁨", userId: 1 })
  //     .set("authorization", refreshToken);
  //   expect(res.status).toBe(200);
  //   expect(res.body.insertId).toBe(10);
  //   expect(res.body.accessToken).toBeDefined();
  // });

  test("postEmoOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "안기쁨", userId: 1 })
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });

  test("postEmoOccurs는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.execute.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "안기쁨", userId: 1 })
      .set("authorization", accessToken);
    expect(res.status).toBe(500);
  });
});

describe("postEmoAndAct", () => {
  test("postEmoAndAct는 accessToken을 인증한 사용자에게 200코드와 연관된 감정과 활동의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    POOL.execute.mockReturnValue([[{ 달리기: 3 }, { 숙면: 2 }]]);
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/EmoOccurrences/1/ActOccurrences")
      .send({ emotionName: "안기쁨" })
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual([
      [{ 달리기: 3 }, { 숙면: 2 }],
      [{ 달리기: 3 }, { 숙면: 2 }],
    ]);
  });

  // test("postEmoAndAct는 refreshToken을 인증한 사용자에게 accessToken과 200코드와 연관된 감정과 활동의 갯수를 가진 배열을 리턴해야 한다.", async () => {
  //   POOL.QUERY.mockReturnValue([{ 달리기: 3 }, { 숙면: 2 }]);
  //   const refreshToken = issueAtoken(1, "refresh", "10s");
  //   const res = await request(app)
  //     .post("/EmoOccurrences/1/ActOccurrences")
  //     .send({ emotionName: "안기쁨" })
  //     .set("authorization", refreshToken);

  //   expect(res.status).toBe(200);
  //   expect(res.body.results).toStrictEqual([
  //     [{ 달리기: 3 }, { 숙면: 2 }],
  //     [{ 달리기: 3 }, { 숙면: 2 }],
  //   ]);
  //   expect(res.body.accessToken).toBeDefined();
  // });

  test("postEmoAndAct는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .post("/EmoOccurrences/1/ActOccurrences")
      .send({ emotionName: "안기쁨" })
      .set("authorization", accessToken);

    expect(res.body.code).toBe(403);
  });

  test("postEmoAndAct는 실패하면 500코드를 리턴해야 한다.", async () => {
    POOL.execute.mockImplementation(() => {
      throw new Error();
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/EmoOccurrences/{userId}/ActOccurrences")
      .send({ emotionName: "안기쁨" })
      .set("authorization", accessToken);
    expect(res.status).toBe(500);
  });
});
