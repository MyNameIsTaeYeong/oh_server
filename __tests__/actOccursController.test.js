const app = require("../app");
const request = require("supertest");
const POOL = require("../db");
const { issueAtoken } = require("../utilities");

jest.mock("../db");

describe("getActOccurs", () => {
  test("getActOccurs는 accessToken을 인증한 사용자에게 ActOccur배열을 반환해야 한다.", async () => {
    POOL.execute.mockReturnValue([
      [
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
      ],
    ]);
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/actoccurrences/1")
      .set("authorization", accessToken);

    expect(res.body).toStrictEqual({
      code: 200,
      results: [
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
      ],
    });
  });

  // test("getActOccurs는 refreshToken을 인증한 사용자에게 accessToken과 ActOccur배열을 반환해야 한다.", async () => {
  //   POOL.QUERY.mockReturnValue([
  //     {
  //       id: 1,
  //       activityName: "운동",
  //       date: "2021-12-29T08:41:47.000Z",
  //       userId: 1,
  //     },
  //     {
  //       id: 2,
  //       activityName: "설거지",
  //       date: "2021-12-29T08:42:26.000Z",
  //       userId: 1,
  //     },
  //   ]);
  //   const refreshToken = issueAtoken(1, "refresh", "10s");
  //   const res = await request(app)
  //     .get("/actoccurrences/1")
  //     .set("authorization", refreshToken);

  //   expect(res.status).toBe(200);
  //   expect(res.body.accessToken).toBeDefined();
  //   expect(res.body.results).toStrictEqual([
  //     {
  //       id: 1,
  //       activityName: "운동",
  //       date: "2021-12-29T08:41:47.000Z",
  //       userId: 1,
  //     },
  //     {
  //       id: 2,
  //       activityName: "설거지",
  //       date: "2021-12-29T08:42:26.000Z",
  //       userId: 1,
  //     },
  //   ]);
  // });

  test("getActOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .get("/actoccurrences/1")
      .set("authorization", accessToken);

    expect(res.body.code).toBe(403);
  });

  test("getActOccurs는 조회에 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.execute.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/actoccurrences/1")
      .set("authorization", accessToken);
    expect(res.statusCode).toBe(500);
  });
});

describe("postActOccurs", () => {
  test("postActOccurs는 accessToken을 인증한 사용자에게 삽입된 활동기록의 아이디를 반환해햐 한다.", async () => {
    POOL.execute.mockReturnValue([{ insertId: 10 }]);
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "달리기", userId: 1 })
      .set("authorization", accessToken);

    expect(res.body).toStrictEqual({
      code: 200,
      insertId: 10,
    });
  });

  // test("postActOccurs는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 활동기록의 아이디를 반환해햐 한다.", async () => {
  //   POOL.QUERY.mockReturnValue([{ insertId: 10 }]);
  //   const refreshToken = issueAtoken(1, "refresh", "10s");
  //   const res = await request(app)
  //     .post("/actoccurrences")
  //     .send({ activityName: "달리기", userId: 1 })
  //     .set("authorization", refreshToken);

  //   expect(res.status).toBe(200);
  //   expect(res.body.insertId).toBe(10);
  //   expect(res.body.accessToken).toBeDefined();
  // });

  test("postActOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "달리기", userId: 1 })
      .set("authorization", accessToken);

    expect(res.body.code).toBe(403);
  });

  test("postActOccurs는 실패하면 500코드를 반환해야한다.", async () => {
    POOL.execute.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "달리기", userId: 1 })
      .set("authorization", accessToken);
    expect(res.status).toBe(500);
  });
});

describe("postActAndEmo", () => {
  test("postActAndEmo는 accessToken을 인증한 사용자에게 200코드와 연관된 활동과 감정의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    POOL.execute.mockReturnValue([
      [
        { name: "기쁨", cnt: 2 },
        { name: "슬픔", cnt: 1 },
      ],
    ]);
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/ActOccurrences/1/EmoOccurrences")
      .send({
        activityName: "달리기",
      })
      .set("authorization", accessToken);
    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual([
      [
        { name: "기쁨", cnt: 2 },
        { name: "슬픔", cnt: 1 },
      ],
      [
        { name: "기쁨", cnt: 2 },
        { name: "슬픔", cnt: 1 },
      ],
    ]);
  });

  // test("postActAndEmo는 refreshToken을 인증한 사용자에게 accessToken과 200코드와 연관된 활동과 감정의 갯수를 가진 배열을 리턴해야 한다.", async () => {
  //   POOL.execute.mockReturnValue([{ 기쁨: 3 }, { 슬픔: 1 }]);
  //   const refreshToken = issueAtoken(1, "refresh", "10s");
  //   const res = await request(app)
  //     .post("/ActOccurrences/1/EmoOccurrences")
  //     .send({
  //       activityName: "달리기",
  //     })
  //     .set("authorization", refreshToken);
  //   expect(res.status).toBe(200);
  //   expect(res.body.results).toStrictEqual([
  //     [{ 기쁨: 3 }, { 슬픔: 1 }],
  //     [{ 기쁨: 3 }, { 슬픔: 1 }],
  //   ]);
  //   expect(res.body.accessToken).toBeDefined();
  // });

  test("postActAndEmo는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .post("/ActOccurrences/1/EmoOccurrences")
      .send({
        activityName: "달리기",
      })
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });

  test("postActAndEmo는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.execute.mockImplementation(() => {
      throw new Error();
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/ActOccurrences/1/EmoOccurrences")
      .send({
        activityName: "달리기",
      })
      .set("authorization", accessToken);
    expect(res.status).toBe(500);
  });
});
