const app = require("../app");
const request = require("supertest");
const POOL = require("../db");
const { issueAtoken } = require("../utilities");

jest.mock("../db");

describe("getActivities", () => {
  test("getActivities는 accessToken을 인증한 사용자에게 activity배열을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      { id: 1, name: "수면부족", userId: 1 },
      { id: 2, name: "운동", userId: 1 },
      { id: 3, name: "독서", userId: 1 },
      { id: 4, name: "설거지", userId: 1 },
    ]);

    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/activities/1")
      .set("authorization", accessToken);

    expect(res.body).toStrictEqual({
      code: 200,
      results: [
        { id: 1, name: "수면부족", userId: 1 },
        { id: 2, name: "운동", userId: 1 },
        { id: 3, name: "독서", userId: 1 },
        { id: 4, name: "설거지", userId: 1 },
      ],
    });
  });

  test("getActivities는 refreshToken을 인증한 사용자에게 accessToken과 activity배열을 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      { id: 1, name: "수면부족", userId: 1 },
      { id: 2, name: "운동", userId: 1 },
      { id: 3, name: "독서", userId: 1 },
      { id: 4, name: "설거지", userId: 1 },
    ]);

    const refreshToken = issueAtoken(1, "refresh", "10s");
    const res = await request(app)
      .get("/activities/1")
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.results).toStrictEqual([
      { id: 1, name: "수면부족", userId: 1 },
      { id: 2, name: "운동", userId: 1 },
      { id: 3, name: "독서", userId: 1 },
      { id: 4, name: "설거지", userId: 1 },
    ]);
  });

  test("getActivities는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue([
      { id: 1, name: "수면부족", userId: 1 },
      { id: 2, name: "운동", userId: 1 },
      { id: 3, name: "독서", userId: 1 },
      { id: 4, name: "설거지", userId: 1 },
    ]);

    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .get("/activities/1")
      .set("authorization", accessToken);

    expect(res.status).toBe(403);
  });

  test("getActivities는 조회에 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/activities/1")
      .set("authorization", accessToken);

    expect(res.statusCode).toBe(500);
  });
});

describe("postActivities", () => {
  test("postActivities는 accessToken을 인증한 사용자에게 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const accessToken = issueAtoken(1, "access", "10s");

    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId: 1 })
      .set("authorization", accessToken);
    expect(res.body).toStrictEqual({
      code: 200,
      insertId: 10,
    });
  });

  test("postActivities는 refreshToken을 인증한 사용자에게 accessToken과 삽입된 데이터 아이디를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const refreshToken = issueAtoken(1, "refresh", "10s");

    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId: 1 })
      .set("authorization", refreshToken);

    expect(res.status).toBe(200);
    expect(res.body.insertId).toBe(10);
    expect(res.body.accessToken).toBeDefined();
  });

  test("postActivities는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue({ insertId: 10 });
    const accessToken = issueAtoken(1, "access", "0s");

    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId: 1 })
      .set("authorization", accessToken);
    expect(res.status).toBe(403);
  });

  test("postActivities는 실패하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error("에러발생");
    });

    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId: 1 })
      .set("authorization", accessToken);
    expect(res.status).toBe(500);
  });
});

describe("deleteActivities", () => {
  test("deleteActivities는 accessToken을 인증한 사용자가 삭제하면 200코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue();
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .delete("/activities/1")
      .set("authorization", accessToken);
    expect(res.status).toBe(200);
  });

  test("deleteActivities는 refreshToken을 인증한 사용자가 삭제하면 accessToken과 200코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue();
    const refreshToken = issueAtoken(1, "refresh", "10s");
    const res = await request(app)
      .delete("/activities/1")
      .set("authorization", refreshToken);
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  test("deleteActivities는 만료된 토큰을 받으면 403코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockReturnValue();
    const accessToken = issueAtoken(1, "access", "0s");
    const res = await request(app)
      .delete("/activities/1")
      .set("authorization", accessToken);
    expect(res.status).toBe(403);
  });

  test("deleteActivities를 삭제에 실피하면 500코드를 반환해야 한다.", async () => {
    POOL.QUERY.mockImplementation(() => {
      throw new Error();
    });
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .delete("/activities/1")
      .set("authorization", accessToken);
    expect(res.status).toBe(500);
  });
});
