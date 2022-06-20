const { cache } = require("../../db");
const Redis = require("../../domains/Redis");

const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("REDIS");
});

describe("Redis", () => {
  test("set & get", async () => {
    Container.set("REDIS", cache);
    const redis = new Redis(Container);
    const resource = "name";
    const id = 1;
    const values = "haha";
    const duration = 10;
    await redis.setCache({ resource, id, duration, values });
    expect(await redis.getCache({ resource, id })).toStrictEqual(values);
  });
});
