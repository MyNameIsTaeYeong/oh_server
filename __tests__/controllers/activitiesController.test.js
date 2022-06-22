const app = require("../../app");
const request = require("supertest");
const { issueAtoken } = require("../../utilities");
const Users = require("../../objForTest/Users");
const Activities = require("../../objForTest/Activities");
const RefreshTokens = require("../../objForTest/RefreshTokens");
require("../../container");
const Container = require("typedi").Container;
let userId;

beforeAll(async () => {
  userId = await Users.createTestUser();
});

afterAll(async () => await Users.deleteTestUser());

describe("getActivities", () => {
  afterEach(async () => {
    await Activities.deleteTestActivity({ userId });
    await RefreshTokens.deleteTestRefreshToken({ userId });
  });

  test("getActivities는 accessToken을 인증한 사용자에게 activity배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    expectedResults.push({
      id: await Activities.createTestActivity({ name: "수면부족", userId }),
      name: "수면부족",
      userId,
    });

    expectedResults.push({
      id: await Activities.createTestActivity({ name: "운동", userId }),
      name: "운동",
      userId,
    });

    expectedResults.push({
      id: await Activities.createTestActivity({ name: "설거지", userId }),
      name: "설거지",
      userId,
    });

    expectedResults.push({
      id: await Activities.createTestActivity({ name: "독서", userId }),
      name: "독서",
      userId,
    });

    // when
    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .get(`/activities/${userId}`)
      .set("authorization", accessToken);

    // then
    expect(res.body).toStrictEqual({
      code: 200,
      results: expectedResults,
    });
  });

  test("getActivities는 refreshToken을 인증한 사용자에게 accessToken과 activity배열을 반환해야 한다.", async () => {
    // given
    const expectedResults = [];

    expectedResults.push({
      id: await Activities.createTestActivity({ name: "수면부족", userId }),
      name: "수면부족",
      userId,
    });

    const refreshToken = issueAtoken(userId, "refresh", "60m");
    Container.set("cache", { get: () => Promise.resolve(refreshToken) });

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
});

// describe("postActivities", () => {
//   afterEach(async () => {
//     await Activities.deleteTestActivity({ userId });
//     await RefreshTokens.deleteTestRefreshToken({ userId });
//   });

//   test("postActivities는 accessToken을 인증한 사용자에게 삽입된 데이터 아이디를 반환해야 한다.", async () => {
//     const accessToken = issueAtoken(userId, "access", "10s");

//     const res = await request(app)
//       .post("/activities")
//       .send({ name: "달리기", userId })
//       .set("authorization", accessToken);

//     expect(res.status).toBe(200);
//     expect(res.body.insertId).toBeDefined();
//   });

//   test.skip("postActivities는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 데이터 아이디를 반환해야 한다.", async () => {
//     const refreshToken = issueAtoken(userId, "refresh", "60m");
//     RefreshTokens.createTestRefreshToken({ userId, refreshToken });

//     const res = await request(app)
//       .post("/activities")
//       .send({ name: "달리기", userId })
//       .set("authorization", refreshToken);

//     expect(res.status).toBe(200);
//     expect(res.body.insertId).toBeDefined();
//     expect(res.body.accessToken).toBeDefined();
//   });

//   test("postActivities는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
//     const accessToken = issueAtoken(userId, "access", "0s");

//     const res = await request(app)
//       .post("/activities")
//       .send({ name: "달리기", userId })
//       .set("authorization", accessToken);
//     expect(res.body.code).toBe(403);
//   });
// });

// describe("deleteActivities", () => {
//   afterEach(async () => {
//     await Activities.deleteTestActivity({ userId });
//     await RefreshTokens.deleteTestRefreshToken({ userId });
//   });

//   test("deleteActivities는 accessToken을 인증한 사용자가 삭제하면 200코드를 반환해야 한다.", async () => {
//     const activityId = await Activities.createTestActivity({
//       name: "test",
//       userId,
//     });
//     const accessToken = issueAtoken(userId, "access", "10s");
//     const res = await request(app)
//       .delete(`/activities/${activityId}`)
//       .set("authorization", accessToken);
//     expect(res.status).toBe(200);
//   });

//   test.skip("deleteActivities는 refreshToken을 인증한 사용자가 삭제하면 accessToken과 200코드를 반환해야 한다.", async () => {
//     const activityId = await Activities.createTestActivity({
//       name: "test",
//       userId,
//     });

//     const refreshToken = issueAtoken(userId, "refresh", "60m");
//     RefreshTokens.createTestRefreshToken({ userId, refreshToken });

//     const res = await request(app)
//       .delete(`/activities/${activityId}`)
//       .set("authorization", refreshToken);
//     expect(res.status).toBe(200);
//     expect(res.body.accessToken).toBeDefined();
//   });

//   test("deleteActivities는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
//     const accessToken = issueAtoken(userId, "access", "0s");
//     const res = await request(app)
//       .delete(`/activities/${userId}`)
//       .set("authorization", accessToken);
//     expect(res.body.code).toBe(403);
//   });
// });
