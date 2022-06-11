const app = require("../app");
const request = require("supertest");
const { issueAtoken } = require("../utilities");
const Users = require("../objForTest/Users");
const ActOccurrences = require("../objForTest/ActOccurrences");
const RefreshTokens = require("../objForTest/RefreshTokens");
const Activities = require("../objForTest/Activities");
const Emotions = require("../objForTest/Emotions");
const EmoOccurrences = require("../objForTest/EmoOccurrences");
const TestCase = require("../objForTest/TestCase");

let userId, recordId;

beforeAll(async () => {
  userId = await Users.createTestUser();
  recordId = await Activities.createTestActivity({ name: "운동", userId });
});

afterAll(async () => await Users.deleteTestUser());

describe("getActOccurs", () => {
  afterEach(async () => {
    await ActOccurrences.deleteTestActOccurs({ userId });
    await RefreshTokens.deleteTestRefreshToken({ userId });
  });

  test("getActOccurs는 accessToken을 인증한 사용자에게 ActOccur배열을 반환해야 한다.", async () => {
    const expectedResults = [];

    const input = [
      {
        activityName: "운동",
        date: "2022-04-12 12:42:34",
        userId,
        recordId,
      },
      {
        activityName: "운동",
        date: "2022-04-13 10:02:34",
        userId,
        recordId,
      },
      {
        activityName: "운동",
        date: "2022-04-13 00:02:34",
        userId,
        recordId,
      },
    ];

    expectedResults.push({
      id: await ActOccurrences.createTestActOccurs(input[0]),
      activityName: "운동",
      date: "22-04-12",
      userId,
      recordId,
    });

    expectedResults.push({
      id: await ActOccurrences.createTestActOccurs(input[1]),
      activityName: "운동",
      date: "22-04-13",
      userId,
      recordId,
    });

    expectedResults.push({
      id: await ActOccurrences.createTestActOccurs(input[2]),
      activityName: "운동",
      date: "22-04-13",
      userId,
      recordId,
    });

    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .get(`/actoccurrences/${userId}`)
      .set("authorization", accessToken);

    expect(res.body).toStrictEqual({
      code: 200,
      results: expectedResults,
    });
  });

  test("getActOccurs는 refreshToken을 인증한 사용자에게 accessToken과 ActOccur배열을 반환해야 한다.", async () => {
    const expectedResults = [];

    const input = [
      {
        activityName: "운동",
        date: "2022-04-12 12:42:34",
        userId,
        recordId,
      },
      {
        activityName: "운동",
        date: "2022-04-13 10:02:34",
        userId,
        recordId,
      },
      {
        activityName: "운동",
        date: "2022-04-13 00:02:34",
        userId,
        recordId,
      },
    ];

    expectedResults.push({
      id: await ActOccurrences.createTestActOccurs(input[0]),
      activityName: "운동",
      date: "22-04-12",
      userId,
      recordId,
    });

    expectedResults.push({
      id: await ActOccurrences.createTestActOccurs(input[1]),
      activityName: "운동",
      date: "22-04-13",
      userId,
      recordId,
    });

    expectedResults.push({
      id: await ActOccurrences.createTestActOccurs(input[2]),
      activityName: "운동",
      date: "22-04-13",
      userId,
      recordId,
    });

    const refreshToken = issueAtoken(userId, "refresh", "10s");
    RefreshTokens.createTestRefreshToken({ userId, refreshToken });

    const res = await request(app)
      .get(`/actoccurrences/${userId}`)
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getActOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");
    const res = await request(app)
      .get(`/actoccurrences/${userId}`)
      .set("authorization", accessToken);

    expect(res.body.code).toBe(403);
  });
});

describe("postActOccurs", () => {
  afterEach(async () => {
    await ActOccurrences.deleteTestActOccurs({ userId });
    await RefreshTokens.deleteTestRefreshToken({ userId });
  });

  test("postActOccurs는 accessToken을 인증한 사용자에게 삽입된 활동기록의 아이디를 반환해햐 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "운동", userId, recordId })
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
  });

  test("postActOccurs는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 활동기록의 아이디를 반환해햐 한다.", async () => {
    const refreshToken = issueAtoken(userId, "refresh", "10s");

    RefreshTokens.createTestRefreshToken({ userId, refreshToken });

    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "운동", userId, recordId })
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  test("postActOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");
    const res = await request(app)
      .post("/actoccurrences")
      .send({ activityName: "운동", userId, recordId })
      .set("authorization", accessToken);

    expect(res.body.code).toBe(403);
  });
});

describe("postActAndEmo", () => {
  beforeAll(async () => await TestCase.case1({ userId, recordId }));

  afterAll(
    async () =>
      await Promise.all([
        Activities.deleteTestActivity({ userId }),
        Emotions.deleteTestEmotion({ userId }),
      ])
  );

  test("postActAndEmo는 accessToken을 인증한 사용자에게 200코드와 연관된 활동과 감정의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .post(`/ActOccurrences/${userId}/EmoOccurrences`)
      .send({
        activityName: "운동",
      })
      .set("authorization", accessToken);

    console.log(res.body.results);

    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual([
      [
        { name: "화남", cnt: 2 },
        { name: "기쁨", cnt: 1 },
        { name: "슬픔", cnt: 1 },
      ],
      [
        { name: "운동", cnt: 3 },
        { name: "독서", cnt: 2 },
        { name: "숙면", cnt: 1 },
      ],
    ]);
  });

  test("postActAndEmo는 refreshToken을 인증한 사용자에게 accessToken과 200코드와 연관된 활동과 감정의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    const refreshToken = issueAtoken(userId, "refresh", "10s");
    RefreshTokens.createTestRefreshToken({ userId, refreshToken });

    const res = await request(app)
      .post(`/ActOccurrences/${userId}/EmoOccurrences`)
      .send({
        activityName: "운동",
      })
      .set("authorization", refreshToken);
    expect(res.status).toBe(200);

    expect(res.body.results).toStrictEqual([
      [
        { name: "화남", cnt: 2 },
        { name: "기쁨", cnt: 1 },
        { name: "슬픔", cnt: 1 },
      ],
      [
        { name: "운동", cnt: 3 },
        { name: "독서", cnt: 2 },
        { name: "숙면", cnt: 1 },
      ],
    ]);
    expect(res.body.accessToken).toBeDefined();
  });

  test("postActAndEmo는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");
    const res = await request(app)
      .post(`/ActOccurrences/${userId}/EmoOccurrences`)
      .send({
        activityName: "운동",
      })
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });
});
