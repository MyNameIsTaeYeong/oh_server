const app = require("../app");
const request = require("supertest");
const { issueAtoken } = require("../utilities");
const Users = require("../objForTest/Users");
const Emotions = require("../objForTest/Emotions");
const EmoOccurrences = require("../objForTest/EmoOccurrences");
const RefreshTokens = require("../objForTest/RefreshTokens");
const TestCase = require("../objForTest/TestCase");
const Activities = require("../objForTest/Activities");

let userId, recordId;

beforeAll(async () => {
  userId = await Users.createTestUser();
  recordId = await Emotions.createTestEmotion({ name: "기쁨", userId });
});

afterAll(async () => await Users.deleteTestUser());

describe("getEmoOccurs", () => {
  afterEach(async () => {
    await EmoOccurrences.deleteTestEmoOccurs({ userId });
    await RefreshTokens.deleteTestRefreshToken({ userId });
  });

  test("getEmoOccurs는 accessToken을 인증한 사용자에게 EmoOccur배열을 반환해야 한다.", async () => {
    const expectedResults = [];

    const input = [
      {
        emotionName: "기쁨",
        date: "2022-04-12 12:42:34",
        userId,
        recordId,
      },
      {
        emotionName: "기쁨",
        date: "2022-04-13 10:02:34",
        userId,
        recordId,
      },
      {
        emotionName: "기쁨",
        date: "2022-04-13 00:02:34",
        userId,
        recordId,
      },
    ];

    expectedResults.push({
      id: await EmoOccurrences.createTestEmoOccurs(input[0]),
      emotionName: "기쁨",
      date: "22-04-12",
      userId,
      recordId,
    });

    expectedResults.push({
      id: await EmoOccurrences.createTestEmoOccurs(input[1]),
      emotionName: "기쁨",
      date: "22-04-13",
      userId,
      recordId,
    });

    expectedResults.push({
      id: await EmoOccurrences.createTestEmoOccurs(input[2]),
      emotionName: "기쁨",
      date: "22-04-13",
      userId,
      recordId,
    });

    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .get(`/emooccurrences/${userId}`)
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getEmoOccurs는 refreshToken을 인증한 사용자에게 accessToken과 EmoOccur배열을 반환해야 한다.", async () => {
    const expectedResults = [];

    const input = [
      {
        emotionName: "기쁨",
        date: "2022-04-12 12:42:34",
        userId,
        recordId,
      },
      {
        emotionName: "기쁨",
        date: "2022-04-13 10:02:34",
        userId,
        recordId,
      },
      {
        emotionName: "기쁨",
        date: "2022-04-13 00:02:34",
        userId,
        recordId,
      },
    ];

    expectedResults.push({
      id: await EmoOccurrences.createTestEmoOccurs(input[0]),
      emotionName: "기쁨",
      date: "22-04-12",
      userId,
      recordId,
    });

    expectedResults.push({
      id: await EmoOccurrences.createTestEmoOccurs(input[1]),
      emotionName: "기쁨",
      date: "22-04-13",
      userId,
      recordId,
    });

    expectedResults.push({
      id: await EmoOccurrences.createTestEmoOccurs(input[2]),
      emotionName: "기쁨",
      date: "22-04-13",
      userId,
      recordId,
    });

    const refreshToken = issueAtoken(userId, "refresh", "10s");
    RefreshTokens.createTestRefreshToken({ userId, refreshToken });

    const res = await request(app)
      .get(`/emooccurrences/${userId}`)
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual(expectedResults);
  });

  test("getEmoOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");
    const res = await request(app)
      .get(`/emooccurrences/${userId}`)
      .set("authorization", accessToken);

    expect(res.body.code).toBe(403);
  });
});

describe("postEmoOccurs", () => {
  afterEach(async () => {
    await EmoOccurrences.deleteTestEmoOccurs({ userId });
    await RefreshTokens.deleteTestRefreshToken({ userId });
  });

  test("postEmoOccurs는 accessToken을 인증한 사용자에게 삽입된 감정기록의 아이디를 반환해햐 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "기쁨", userId, recordId })
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
  });

  test("postEmoOccurs는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 감정기록의 아이디를 반환해햐 한다.", async () => {
    const refreshToken = issueAtoken(userId, "refresh", "10s");

    RefreshTokens.createTestRefreshToken({ userId, refreshToken });

    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "기쁨", userId, recordId })
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
  });

  test("postEmoOccurs는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");
    const res = await request(app)
      .post("/emooccurrences")
      .send({ emotionName: "기쁨", userId, recordId })
      .set("authorization", accessToken);
    expect(res.body.code).toBe(403);
  });
});

describe("postEmoAndAct", () => {
  beforeAll(async () => await TestCase.case2({ userId, recordId }));

  afterAll(
    async () =>
      await Promise.all([
        Activities.deleteTestActivity({ userId }),
        Emotions.deleteTestEmotion({ userId }),
      ])
  );

  test("postEmoAndAct는 accessToken을 인증한 사용자에게 200코드와 연관된 감정과 활동의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "10s");
    const res = await request(app)
      .post(`/EmoOccurrences/${userId}/ActOccurrences`)
      .send({ emotionName: "기쁨" })
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual([
      [
        { name: "기쁨", cnt: 3 },
        { name: "화남", cnt: 2 },
        { name: "짜증", cnt: 1 },
      ],
      [
        { name: "청소", cnt: 2 },
        { name: "운동", cnt: 1 },
        { name: "숙면", cnt: 1 },
      ],
    ]);
  });

  test("postEmoAndAct는 refreshToken을 인증한 사용자에게 accessToken과 200코드와 연관된 감정과 활동의 갯수를 가진 배열을 리턴해야 한다.", async () => {
    const refreshToken = issueAtoken(userId, "refresh", "10s");
    RefreshTokens.createTestRefreshToken({ userId, refreshToken });

    const res = await request(app)
      .post(`/EmoOccurrences/${userId}/ActOccurrences`)
      .send({ emotionName: "기쁨" })
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual([
      [
        { name: "기쁨", cnt: 3 },
        { name: "화남", cnt: 2 },
        { name: "짜증", cnt: 1 },
      ],
      [
        { name: "청소", cnt: 2 },
        { name: "운동", cnt: 1 },
        { name: "숙면", cnt: 1 },
      ],
    ]);
  });

  test("postEmoAndAct는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    const accessToken = issueAtoken(userId, "access", "0s");
    const res = await request(app)
      .post(`/EmoOccurrences/${userId}/ActOccurrences`)
      .send({ emotionName: "기쁨" })
      .set("authorization", accessToken);

    expect(res.body.code).toBe(403);
  });
});
