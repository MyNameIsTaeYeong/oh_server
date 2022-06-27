const app = require("../../app");
const request = require("supertest");
const { issueAtoken } = require("../../utilities");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const MySqlActivityRepository = require("../../repositories/mysql/MySqlActivityRepository");
const User = require("../../domains/User");
const Activity = require("../../domains/Activity");
require("../../container");
const Container = require("typedi").Container;

let userId;

const userDB = new MySqlUserRepository(Container);
const activityDB = new MySqlActivityRepository(Container);

beforeAll(async () => {
  userId = await userDB.saveForTest(new User({ email: "test" }));
});

afterAll(async () => {
  await userDB.clear();
  await Container.get("cache").flushAll();
  Container.get("POOL").end();
  Container.get("cache").QUIT();
});

describe("getActivities", () => {
  afterEach(async () => {
    await activityDB.clear();
  });

  test("getActivities는 accessToken을 인증한 사용자에게 activity배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    await Promise.all([
      activityDB
        .save(new Activity({ name: "수면부족", userId }))
        .then((id) => expectedResults.push({ id, name: "수면부족", userId })),
      activityDB
        .save(new Activity({ name: "운동", userId }))
        .then((id) => expectedResults.push({ id, name: "운동", userId })),
      activityDB
        .save(new Activity({ name: "설거지", userId }))
        .then((id) => expectedResults.push({ id, name: "설거지", userId })),
    ]);

    console.log(expectedResults);

    // when
    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .get(`/activities/${userId}`)
      .set("authorization", accessToken);

    // then
    console.log(res.body.results);
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getActivities는 refreshToken을 인증한 사용자에게 accessToken과 activity배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    expectedResults.push({
      id: await activityDB.save(new Activity({ name: "수면부족", userId })),
      name: "수면부족",
      userId,
    });

    const refreshToken = issueAtoken(userId, "refresh", "60m");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .get(`/activities/${userId}`)
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getActivities는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .get(`/activities/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

describe("postActivities", () => {
  afterEach(async () => {
    await activityDB.clear();
  });

  test("postActivities는 accessToken을 인증한 사용자에게 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId })
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
  });

  test("postActivities는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    // given
    const refreshToken = issueAtoken(userId, "refresh", "60m");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId })
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  test("postActivities는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId })
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

describe("deleteActivities", () => {
  afterEach(async () => {
    await activityDB.clear();
  });

  test("deleteActivities는 accessToken을 인증한 사용자가 삭제하면 200코드를 반환해야 한다.", async () => {
    // given
    const activityId = await activityDB.save(
      new Activity({
        name: "test",
        userId,
      })
    );
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .delete(`/activities/${activityId}`)
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(200);
  });

  test("deleteActivities는 refreshToken을 인증한 사용자가 삭제하면 accessToken과 200코드를 반환해야 한다.", async () => {
    // given
    const activityId = await activityDB.save(
      new Activity({
        name: "test",
        userId,
      })
    );

    const refreshToken = issueAtoken(userId, "refresh", "60m");
    await Container.get("cache").set(
      `${"RefreshToken"}:${userId}`,
      refreshToken
    );

    // when
    const res = await request(app)
      .delete(`/activities/${activityId}`)
      .set("authorization", refreshToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test("deleteActivities는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "0s");

    // when
    const res = await request(app)
      .delete(`/activities/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.body.code).toBe(403);
  });
});

test("getActivities가 던지는 에러는 에러 처리 미들웨어로 모인다.", async () => {
  // given
  const accessToken = issueAtoken(userId, "access", "10s");
  Container.set("ActivityService", {
    selectRecords: () => Promise.reject("ja"),
  });

  // when
  const res = await request(app)
    .get(`/activities/${userId}`)
    .set("authorization", accessToken);

  // then
  expect(res.status).toBe(500);
});
