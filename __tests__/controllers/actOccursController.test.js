const app = require("../../app");
const request = require("supertest");
const { issueAtoken } = require("../../utilities");
const TestCase = require("../../objForTest/TestCase");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const MySqlActivityRepository = require("../../repositories/mysql/MySqlActivityRepository");
const User = require("../../domains/User");
const Activity = require("../../domains/Activity");
const MySqlActivityOccurRepository = require("../../repositories/mysql/MySqlActivityOccurRepository");
const ActOccur = require("../../domains/ActOccur");
const MySqlEmotionRepository = require("../../repositories/mysql/MySqlEmotionRepository");
const MySqlEmotionOccurRepository = require("../../repositories/mysql/MySqlEmotionOccurRepository");

require("../../container");
const Container = require("typedi").Container;

const userDB = new MySqlUserRepository(Container);
const activityDB = new MySqlActivityRepository(Container);
const actOccurDB = new MySqlActivityOccurRepository(Container);
const emotionDB = new MySqlEmotionRepository(Container);
const emoOccurDB = new MySqlEmotionOccurRepository(Container);

let userId, recordId;

beforeAll(async () => {
  userId = await userDB.save(new User({ email: "test" }));
  recordId = await activityDB.save(new Activity({ name: "운동", userId }));
});

afterAll(async () => {
  await userDB.clear();
  await Container.get("cache").flushAll();
  Container.get("POOL").end();
  Container.get("cache").QUIT();
});

describe("getActOccurs", () => {
  afterEach(async () => {
    await actOccurDB.clear();
  });

  test("getActOccurs는 accessToken을 인증한 사용자에게 ActOccur배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    await Promise.all([
      actOccurDB
        .save(
          new ActOccur({
            name: "운동",
            date: "22-04-12 12:42:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "운동",
            date: "22-04-12",
            userId,
            recordId,
          })
        ),
      actOccurDB
        .save(
          new ActOccur({
            name: "운동",
            date: "22-04-13 10:02:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "운동",
            date: "22-04-13",
            userId,
            recordId,
          })
        ),
      actOccurDB
        .save(
          new ActOccur({
            name: "운동",
            date: "22-04-13 12:02:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "운동",
            date: "22-04-13",
            userId,
            recordId,
          })
        ),
    ]);
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .get(`/actoccurrences/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.body).toStrictEqual({
      code: 200,
      results: expectedResults,
    });
  });

  test("getActOccurs는 refreshToken을 인증한 사용자에게 accessToken과 ActOccur배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    await Promise.all([
      actOccurDB
        .save(
          new ActOccur({
            name: "운동",
            date: "22-04-12 12:42:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "운동",
            date: "22-04-12",
            userId,
            recordId,
          })
        ),
      actOccurDB
        .save(
          new ActOccur({
            name: "운동",
            date: "22-04-13 10:02:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "운동",
            date: "22-04-13",
            userId,
            recordId,
          })
        ),
      actOccurDB
        .save(
          new ActOccur({
            name: "운동",
            date: "22-04-13 12:02:34",
            userId,
            recordId,
          })
        )
        .then((id) =>
          expectedResults.push({
            id,
            name: "운동",
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
      .get(`/actoccurrences/${userId}`)
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getActOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .get(`/actoccurrences/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

describe("postActOccurs", () => {
  afterEach(async () => {
    await actOccurDB.clear();
  });

  test("postActOccurs는 accessToken을 인증한 사용자에게 삽입된 활동기록의 아이디를 반환해햐 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "운동", userId, recordId })
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
  });

  test("postActOccurs는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 활동기록의 아이디를 반환해햐 한다.", async () => {
    // given
    const refreshToken = issueAtoken(userId, "refresh", "10s");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "운동", userId, recordId })
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  test("postActOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "운동", userId, recordId })
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

describe("postActAndEmo", () => {
  beforeAll(async () => {
    // given
    await TestCase.case1({ userId, recordId });
  });

  afterAll(
    async () => await Promise.all([activityDB.clear(), emotionDB.clear()])
  );

  test("postActAndEmo는 accessToken을 인증한 사용자에게 200코드와 연관된 활동과 감정의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .post(`/ActOccurrences/${userId}/EmoOccurrences`)
      .send({
        activityName: "운동",
        recordId,
      })
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(200);

    expect(res.body.results).toStrictEqual([
      { 운동: 3, 독서: 2, 숙면: 1 },
      { 화남: 2, 기쁨: 1, 슬픔: 1 },
    ]);
  });

  test("postActAndEmo는 refreshToken을 인증한 사용자에게 accessToken과 200코드와 연관된 활동과 감정의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    // given
    const refreshToken = issueAtoken(userId, "refresh", "10s");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .post(`/ActOccurrences/${userId}/EmoOccurrences`)
      .send({
        activityName: "운동",
        recordId,
      })
      .set("authorization", refreshToken);
    expect(res.status).toBe(200);

    // then
    expect(res.body.results).toStrictEqual([
      { 운동: 3, 독서: 2, 숙면: 1 },
      { 화남: 2, 기쁨: 1, 슬픔: 1 },
    ]);
    expect(res.body.accessToken).toBeDefined();
  });

  test("postActAndEmo는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .post(`/ActOccurrences/${userId}/EmoOccurrences`)
      .send({
        activityName: "운동",
      })
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});
