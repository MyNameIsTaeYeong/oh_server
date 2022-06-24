const app = require("../../app");
const request = require("supertest");

const { issueAtoken } = require("../../utilities");

const MySqlEmotionRepository = require("../../repositories/mysql/MySqlEmotionRepository");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const User = require("../../domains/User");
const Emotion = require("../../domains/Emotion");
require("../../container");
const Container = require("typedi").Container;

const userDB = new MySqlUserRepository(Container);
const emotionDB = new MySqlEmotionRepository(Container);

let userId;

beforeAll(
  async () => (userId = await userDB.save(new User({ email: "test" })))
);

afterAll(async () => {
  await userDB.clear();
  await Container.get("cache").flushAll();
  Container.get("POOL").end();
  Container.get("cache").QUIT();
});

describe("getEmotions", () => {
  afterEach(async () => {
    await emotionDB.clear();
  });

  test("getEmotions는 accessToken을 인증한 사용자에게 Emotion배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    await Promise.all([
      emotionDB
        .save(new Emotion({ name: "기쁨", userId }))
        .then((id) => expectedResults.push({ id, name: "기쁨", userId })),
      emotionDB
        .save(new Emotion({ name: "슬픔", userId }))
        .then((id) => expectedResults.push({ id, name: "슬픔", userId })),
      emotionDB
        .save(new Emotion({ name: "화남", userId }))
        .then((id) => expectedResults.push({ id, name: "화남", userId })),
    ]);

    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .get(`/emotions/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.body.accessToken).toBeUndefined();
    expect(res.body).toStrictEqual({
      code: 200,
      results: expectedResults,
    });
  });

  test("getEmotions는 refreshToken을 인증한 사용자에게 accessToken과 Emotion배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    await Promise.all([
      emotionDB
        .save(new Emotion({ name: "기쁨", userId }))
        .then((id) => expectedResults.push({ id, name: "기쁨", userId })),
      emotionDB
        .save(new Emotion({ name: "슬픔", userId }))
        .then((id) => expectedResults.push({ id, name: "슬픔", userId })),
      emotionDB
        .save(new Emotion({ name: "화남", userId }))
        .then((id) => expectedResults.push({ id, name: "화남", userId })),
    ]);

    const refreshToken = issueAtoken(userId, "refresh", "10s");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .get(`/emotions/${userId}`)
      .set("authorization", refreshToken);

    // then
    expect(res.body.code).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .get(`/emotions/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

describe("postEmotions", () => {
  afterEach(async () => {
    await emotionDB.clear();
  });

  test("postEmotions는 accessToken을 인증한 사용자에게 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .post("/emotions")
      .send({ name: "기쁨", userId })
      .set("authorization", accessToken);

    //  then
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
  });

  test("postEmotions는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    // given
    const refreshToken = issueAtoken(userId, "refresh", "10s");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .post("/emotions")
      .send({ name: "기쁨", userId })
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  test("postEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .post("/emotions")
      .send({ name: "기쁨", userId: 1 })
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

describe("deleteEmotions", () => {
  afterEach(async () => {
    await emotionDB.clear();
  });

  test("deleteEmotions는 accessToken을 인증한 사용자가 삭제하면 200코드를 반환해야 한다.", async () => {
    // given
    const emotionId = await emotionDB.save(
      new Emotion({
        name: "test",
        userId,
      })
    );

    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .delete(`/emotions/${emotionId}`)
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(200);
  });

  test("deleteEmotions는 refreshToken을 인증한 사용자가 삭제하면 accessToken과 200코드를 반환해야 한다.", async () => {
    // given
    const emotionId = await emotionDB.save(
      new Emotion({
        name: "test",
        userId,
      })
    );

    const refreshToken = issueAtoken(userId, "refresh", "10s");
    Container.set("ActivityService", {
      selectRecords: () => Promise.reject("ja"),
    });

    // when
    const res = await request(app)
      .delete(`/emotions/${emotionId}`)
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test("deleteEmotions는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .delete("/emotions/1")
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});
