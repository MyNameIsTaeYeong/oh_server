const app = require("../../app");
const request = require("supertest");
const { issueAtoken } = require("../../utilities");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const MySqlEmotionRepository = require("../../repositories/mysql/MySqlEmotionRepository");
const MySqlEmotionOccurRepository = require("../../repositories/mysql/MySqlEmotionOccurRepository");
const User = require("../../domains/User");
const Emotion = require("../../domains/Emotion");
const EmoOccur = require("../../domains/EmoOccur");
const TestCase = require("../../TestCase/TestCase");
const MySqlActivityRepository = require("../../repositories/mysql/MySqlActivityRepository");

require("../../container");
const Container = require("typedi").Container;

const userDB = new MySqlUserRepository(Container);
const emotionDB = new MySqlEmotionRepository(Container);
const emoOccurDB = new MySqlEmotionOccurRepository(Container);
const activityDB = new MySqlActivityRepository(Container);

let userId, recordId;

beforeAll(async () => {
  userId = await userDB.saveForTest(new User({ email: "test" }));
  recordId = await emotionDB.save(new Emotion({ name: "기쁨", userId }));
});

afterAll(async () => {
  await userDB.clear();
  await Container.get("cache").flushAll();
  Container.get("POOL").end();
  Container.get("cache").QUIT();
});

describe("getEmoOccurs", () => {
  afterEach(async () => {
    await emoOccurDB.clear();
  });

  test("getEmoOccurs는 accessToken을 인증한 사용자에게 EmoOccur배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    await Promise.all([
      emoOccurDB
        .save(
          new EmoOccur({
            name: "기쁨",
            date: "22-04-12 12:42:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "기쁨",
            date: "22-04-12",
            userId,
            recordId,
          })
        ),
      emoOccurDB
        .save(
          new EmoOccur({
            name: "기쁨",
            date: "22-04-13 10:02:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "기쁨",
            date: "22-04-13",
            userId,
            recordId,
          })
        ),
      emoOccurDB
        .save(
          new EmoOccur({
            name: "기쁨",
            date: "22-04-13 00:02:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "기쁨",
            date: "22-04-13",
            userId,
            recordId,
          })
        ),
    ]);

    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .get(`/emooccurrences/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getEmoOccurs는 refreshToken을 인증한 사용자에게 accessToken과 EmoOccur배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    await Promise.all([
      emoOccurDB
        .save(
          new EmoOccur({
            name: "기쁨",
            date: "22-04-12 12:42:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "기쁨",
            date: "22-04-12",
            userId,
            recordId,
          })
        ),
      emoOccurDB
        .save(
          new EmoOccur({
            name: "기쁨",
            date: "22-04-13 10:02:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "기쁨",
            date: "22-04-13",
            userId,
            recordId,
          })
        ),
      emoOccurDB
        .save(
          new EmoOccur({
            name: "기쁨",
            date: "22-04-13 00:02:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "기쁨",
            date: "22-04-13",
            userId,
            recordId,
          })
        ),
    ]);

    const refreshToken = issueAtoken(userId, "refresh", "10s");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .get(`/emooccurrences/${userId}`)
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getEmoOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .get(`/emooccurrences/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

describe("postEmoOccurs", () => {
  afterEach(async () => {
    await emoOccurDB.clear();
  });

  test("postEmoOccurs는 accessToken을 인증한 사용자에게 삽입된 감정기록의 아이디를 반환해햐 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "기쁨", userId, recordId })
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
  });

  test("postEmoOccurs는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 감정기록의 아이디를 반환해햐 한다.", async () => {
    // given
    const refreshToken = issueAtoken(userId, "refresh", "10s");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "기쁨", userId, recordId })
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  test("postEmoOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "기쁨", userId, recordId })
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

describe("postEmoAndAct", () => {
  beforeAll(async () => {
    // given
    await TestCase.case2({ userId, recordId });
  });

  afterAll(
    async () => await Promise.all([activityDB.clear(), emotionDB.clear()])
  );

  test("postEmoAndAct는 accessToken을 인증한 사용자에게 200코드와 연관된 감정과 활동의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .post(`/EmoOccurrences/${userId}/ActOccurrences`)
      .send({ emotionName: "기쁨", recordId })
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual([
      { 기쁨: 3, 화남: 2, 짜증: 1 },
      { 청소: 2, 운동: 1, 숙면: 1 },
    ]);
  });

  test("postEmoAndAct는 refreshToken을 인증한 사용자에게 accessToken과 200코드와 연관된 감정과 활동의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    // given
    const refreshToken = issueAtoken(userId, "refresh", "10s");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .post(`/EmoOccurrences/${userId}/ActOccurrences`)
      .send({ emotionName: "기쁨", recordId })
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual([
      { 기쁨: 3, 화남: 2, 짜증: 1 },
      { 청소: 2, 운동: 1, 숙면: 1 },
    ]);
  });

  test("postEmoAndAct는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .post(`/EmoOccurrences/${userId}/ActOccurrences`)
      .send({ emotionName: "기쁨", recordId })
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});
