const app = require("../app");
const request = require("supertest");
const queries = require("../controllers/queries");

jest.mock("../controllers/queries");

//[{"date": "2021-12-29T08:39:55.000Z", "emotionName": "기쁨", "id": 1, "userId": 1}, {"date": "2021-12-29T08:39:55.000Z", "emotionName": "슬픔", "id": 2, "userId": 1}]
describe("getEmoOccurs", () => {
  test("정상인 경우", async () => {
    queries.selectEmoOccurs.mockReturnValue([
      {
        date: "2021-12-29T08:39:55.000Z",
        emotionName: "기쁨",
        id: 1,
        userId: 1,
      },
      {
        date: "2021-12-29T08:39:55.000Z",
        emotionName: "슬픔",
        id: 2,
        userId: 1,
      },
    ]);

    const res = await request(app).get("/emooccurrences/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([
      {
        date: "2021-12-29T08:39:55.000Z",
        emotionName: "기쁨",
        id: 1,
        userId: 1,
      },
      {
        date: "2021-12-29T08:39:55.000Z",
        emotionName: "슬픔",
        id: 2,
        userId: 1,
      },
    ]);
  });
});
