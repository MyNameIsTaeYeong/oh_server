const app = require("../app");
const request = require("supertest");
const POOL = require("../db");
const { issueAtoken } = require("../utilities");

jest.mock("../db");

describe("getEmotions", () => {
  test("getEmotions는 accessToken을 인증한 사용자에게 Emotion배열을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      { id: 1, name: "기쁨", userId: 1 },
      { id: 2, name: "슬픔", userId: 1 },
      { id: 3, name: "분노", userId: 1 },
    ]);

    const accessToken = issueAtoken(1, "access", "10s");

    const res = await request(app)
      .get("/emotions/1")
      .set("authorization", accessToken);

    expect(res.body.accessToken).toBeUndefined();
    expect(res.body).toStrictEqual({
      code: 200,
      results: [
        { id: 1, name: "기쁨", userId: 1 },
        { id: 2, name: "슬픔", userId: 1 },
        { id: 3, name: "분노", userId: 1 },
      ],
    });
  });

  test("getEmotions는 refreshToken을 인증한 사용자에게 accessToken과 Emotion배열을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      { id: 1, name: "기쁨", userId: 1 },
      { id: 2, name: "슬픔", userId: 1 },
      { id: 3, name: "분노", userId: 1 },
    ]);

    const refreshToken = issueAtoken(1, "refresh", "10s");

    const res = await request(app)
      .get("/emotions/1")
      .set("authorization", refreshToken);

    expect(res.body.code).toBe(200);
    expect(res.body.results).toStrictEqual([
      { id: 1, name: "기쁨", userId: 1 },
      { id: 2, name: "슬픔", userId: 1 },
      { id: 3, name: "분노", userId: 1 },
    ]);
    expect(res.body.accessToken).toBeDefined();
  });

  test("getEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(1, "access", "0s");

    const res = await request(app)
      .get("/emotions/1")
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });

  test("getEmotions는 데이터조회가 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/emotions/1")
      .set("authorization", accessToken);
    expect(res.statusCode).toBe(500);
  });
});

describe("postEmotions", () => {
  test("postEmotions는 accessToken을 인증한 사용자에게 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/emotions")
      .send({ name: "ㅁㅁㅁㅁ", userId: 1 })
      .set("authorization", accessToken);

    expect(res.body).toStrictEqual({
      code: 200,
      insertId: 10,
    });
  });

  test("postEmotions는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const refreshToken = issueAtoken(1, "refresh", "10s");
    const res = await request(app)
      .post("/emotions")
      .send({ name: "ㅁㅁㅁㅁ", userId: 1 })
      .set("authorization", refreshToken);
    expect(res.body.accessToken).toBeDefined();
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBe(10);
  });

  test("postEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(1, "access", "0s");

    const res = await request(app)
      .post("/emotions")
      .send({ name: "ㅁㅁㅁㅁ", userId: 1 })
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
    expect(res.body.accessToken).toBeUndefined();
  });

  test("postEmotions는 데이터삽입에 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/emotions")
      .send({ name: "ㅁㅁㅁㅁ", userId: 1 })
      .set("authorization", accessToken);
    expect(res.statusCode).toBe(500);
  });
});

describe("deleteEmotions", () => {
  test("deleteEmotions는 accessToken을 인증한 사용자가 삭제하면 200코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue();
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .delete("/emotions/1")
      .set("authorization", accessToken);
    expect(res.status).toBe(200);
  });

  test("deleteEmotions는 refreshToken을 인증한 사용자가 삭제하면 accessToken과 200코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue();
    const refreshToken = issueAtoken(1, "refresh", "10s");
    const res = await request(app)
      .delete("/emotions/1")
      .set("authorization", refreshToken);
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test("deleteEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue();
    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .delete("/emotions/1")
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });

  test("deleteEmotions는 삭제에 실피하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error();
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .delete("/emotions/1")
      .set("authorization", accessToken);
    expect(res.status).toBe(500);
  });
});
