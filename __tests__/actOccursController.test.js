const app = require("../app");
const request = require("supertest");
const queries = require("../controllers/queries");

jest.mock("../controllers/queries");

describe("getActOccurs", () => {
  test("정상인 경우", async () => {
    queries.selectActOccurs.mockReturnValue([
      {
        id: 1,
        activityName: "운동",
        date: "2021-12-29T08:41:47.000Z",
        userId: 1,
      },
      {
        id: 2,
        activityName: "설거지",
        date: "2021-12-29T08:42:26.000Z",
        userId: 1,
      },
    ]);
    const res = await request(app).get("/actoccurrences/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual([
      {
        id: 1,
        activityName: "운동",
        date: "2021-12-29T08:41:47.000Z",
        userId: 1,
      },
      {
        id: 2,
        activityName: "설거지",
        date: "2021-12-29T08:42:26.000Z",
        userId: 1,
      },
    ]);
  });
});
