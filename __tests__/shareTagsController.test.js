const app = require("../app");
const request = require("supertest");
const POOL = require("../db");
const { issueAtoken } = require("../utilities");

jest.mock("../db");

describe("postShareTags", () => {
  test("postShareTags는 accessToken을 인증한 사용자에게 삽입된 테그 아이디를 반환해야 한다.", async () => {
    POOL.execute.mockReturnValue([{ insertId: 10 }]);
    const accessToken = issueAtoken(1, "access", "10s");

    const res = await request(app)
      .post("/sharetags")
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      code: 200,
      insertId: 10,
    });
  });

  test("postShareTags는 DB에러가 발생하면 500을 반환한다.", async () => {
    POOL.execute.mockImplementation(() => {
      throw new Error("DB error");
    });
    const accessToken = issueAtoken(1, "access", "10s");

    const res = await request(app)
      .post("/sharetags")
      .set("authorization", accessToken);

    expect(res.status).toBe(500);
  });
});

describe("getShareTags", () => {
  test("getShareTags는 accessToken을 인증한 사용자에게 ShareTags를 반환한다.", async () => {
    POOL.execute.mockReturnValue([
      [
        { id: 1, content: "기쁨", userId: 1, likeCnt: 2 },
        { id: 2, content: "슬픔", userId: 1, likeCnt: 0 },
        { id: 3, content: "분노", userId: 1, likeCnt: 1 },
      ],
    ]);
    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/sharetags/1")
      .set("authorization", accessToken);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      code: 200,
      results: [
        { id: 1, content: "기쁨", userId: 1, likeCnt: 2 },
        { id: 2, content: "슬픔", userId: 1, likeCnt: 0 },
        { id: 3, content: "분노", userId: 1, likeCnt: 1 },
      ],
    });
  });

  test("getShareTags는 DB에러가 발생하면 500을 반환한다.", async () => {
    POOL.execute.mockImplementation(() => {
      throw new Error("DB error");
    });

    const accessToken = issueAtoken(1, "access", "10s");
    const res = await request(app)
      .get("/sharetags/1")
      .set("authorization", accessToken);

    expect(res.status).toBe(500);
  });
});
