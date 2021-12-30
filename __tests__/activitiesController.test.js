const app = require("../app");
const request = require("supertest");
const queries = require("../controllers/queries");

jest.mock("../controllers/queries");

describe("getActivities", () => {
  test("정상인 경우", async () => {
    queries.selectActivities.mockReturnValue([
      { id: 1, name: "수면부족", userId: 1 },
      { id: 2, name: "운동", userId: 1 },
      { id: 3, name: "독서", userId: 1 },
      { id: 4, name: "설거지", userId: 1 },
    ]);
    const res = await request(app).get("/activities/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([
      { id: 1, name: "수면부족", userId: 1 },
      { id: 2, name: "운동", userId: 1 },
      { id: 3, name: "독서", userId: 1 },
      { id: 4, name: "설거지", userId: 1 },
    ]);
  });
});

describe("postActivities", () => {
  test("활동 생성 성공", async () => {
    queries.insertActivities.mockReturnValue({ insertId: 10 });
    const res = await request(app)
      .post("/activities")
      .send({ name: "달리기", userId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(10);
  });
});
