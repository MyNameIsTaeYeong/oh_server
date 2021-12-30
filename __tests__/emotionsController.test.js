const app = require("../app");
const request = require("supertest");
const queries = require("../controllers/queries");

jest.mock("../controllers/queries");

describe.skip("getEmotions", () => {
  test("정상인 경우", async () => {
    queries.selectEmotions.mockReturnValue([
      { id: 1, name: "기쁨", userId: 1 },
      { id: 2, name: "슬픔", userId: 1 },
      { id: 3, name: "분노", userId: 1 },
    ]);
    const res = await request(app).get("/emotions/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([
      { id: 1, name: "기쁨", userId: 1 },
      { id: 2, name: "슬픔", userId: 1 },
      { id: 3, name: "분노", userId: 1 },
    ]);
  });
});

describe("postEmotions", () => {
  test("감정 생성 성공", async () => {
    queries.insertEmotions.mockReturnValue({ insertId: 10 });
    const res = await request(app)
      .post("/emotions")
      .send({ name: "ㅁㅁㅁㅁ", userId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(10);
  });
});
