const app = require("../app");
const request = require("supertest");
const POOL = require("../db");
const { issueAtoken } = require("../utilities");
const Users = require("../objForTest/Users");
const Emotions = require("../objForTest/Emotions");
const RefreshTokens = require("../objForTest/RefreshTokens");

let userId;

beforeAll(async () => (userId = await Users.createTestUser()));

afterAll(async () => await Users.deleteTestUser());

describe("getEmotions", () => {
  afterEach(async () => {
    await Emotions.deleteTestEmotion({ userId });
    await RefreshTokens.deleteTestRefreshToken({ userId });
  });

  test("getEmotions는 accessToken을 인증한 사용자에게 Emotion배열을 반환해야 한다.", async () => {
    const expectedResults = [];

    expectedResults.push({
      id: await Emotions.createTestEmotion({ name: "기쁨", userId }),
      name: "기쁨",
      userId,
    });

    expectedResults.push({
      id: await Emotions.createTestEmotion({ name: "슬픔", userId }),
      name: "슬픔",
      userId,
    });

    expectedResults.push({
      id: await Emotions.createTestEmotion({ name: "화남", userId }),
      name: "화남",
      userId,
    });

    expectedResults.push({
      id: await Emotions.createTestEmotion({ name: "짜증", userId }),
      name: "짜증",
      userId,
    });

    const accessToken = issueAtoken(userId, "access", "10s");

    const res = await request(app)
      .get(`/emotions/${userId}`)
      .set("authorization", accessToken);

    expect(res.body.accessToken).toBeUndefined();
    expect(res.body).toStrictEqual({
      code: 200,
      results: expectedResults,
    });
  });

  test("getEmotions는 refreshToken을 인증한 사용자에게 accessToken과 Emotion배열을 반환해야 한다.", async () => {
    const expectedResults = [];

    expectedResults.push({
      id: await Emotions.createTestEmotion({ name: "기쁨", userId }),
      name: "기쁨",
      userId,
    });

    expectedResults.push({
      id: await Emotions.createTestEmotion({ name: "슬픔", userId }),
      name: "슬픔",
      userId,
    });

    expectedResults.push({
      id: await Emotions.createTestEmotion({ name: "화남", userId }),
      name: "화남",
      userId,
    });

    expectedResults.push({
      id: await Emotions.createTestEmotion({ name: "짜증", userId }),
      name: "짜증",
      userId,
    });

    const refreshToken = issueAtoken(userId, "refresh", "10s");
    RefreshTokens.createTestRefreshToken({ userId, refreshToken });

    const res = await request(app)
      .get(`/emotions/${userId}`)
      .set("authorization", refreshToken);

    expect(res.body.code).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");

    const res = await request(app)
      .get(`/emotions/${userId}`)
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });
});

describe("postEmotions", () => {
  afterEach(async () => {
    await Emotions.deleteTestEmotion({ userId });
    await RefreshTokens.deleteTestRefreshToken({ userId });
  });

  test("postEmotions는 accessToken을 인증한 사용자에게 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .post("/emotions")
      .send({ name: "기쁨", userId })
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
  });

  test("postEmotions는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    const refreshToken = issueAtoken(userId, "refresh", "10s");
    RefreshTokens.createTestRefreshToken({ userId, refreshToken });
    const res = await request(app)
      .post("/emotions")
      .send({ name: "기쁨", userId })
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  test("postEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");

    const res = await request(app)
      .post("/emotions")
      .send({ name: "기쁨", userId: 1 })
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });
});

describe("deleteEmotions", () => {
  afterEach(async () => {
    await Emotions.deleteTestEmotion({ userId });
    await RefreshTokens.deleteTestRefreshToken({ userId });
  });

  test("deleteEmotions는 accessToken을 인증한 사용자가 삭제하면 200코드를 반환해야 한다.", async () => {
    const emotionId = await Emotions.createTestEmotion({
      name: "test",
      userId,
    });
    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .delete(`/emotions/${emotionId}`)
      .set("authorization", accessToken);
    expect(res.status).toBe(200);
  });

  test("deleteEmotions는 refreshToken을 인증한 사용자가 삭제하면 accessToken과 200코드를 반환해야 한다.", async () => {
    const emotionId = await Emotions.createTestEmotion({
      name: "test",
      userId,
    });

    const refreshToken = issueAtoken(userId, "refresh", "10s");
    RefreshTokens.createTestRefreshToken({ userId, refreshToken });

    const res = await request(app)
      .delete(`/emotions/${emotionId}`)
      .set("authorization", refreshToken);
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test("deleteEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");
    const res = await request(app)
      .delete("/emotions/1")
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });
});
