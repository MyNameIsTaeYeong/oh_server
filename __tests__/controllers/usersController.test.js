const request = require("supertest");
const app = require("../../app");
const dotenv = require("dotenv");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const User = require("../../domains/User");
dotenv.config();

require("../../container");
const Container = require("typedi").Container;

const userDB = new MySqlUserRepository(Container);
const cache = Container.get("cache");

afterEach(async () => {
  await userDB.clear();
  await Container.get("cache").flushAll();
});

afterAll(() => {
  Container.get("POOL").end();
  Container.get("cache").QUIT();
});

describe("getUsers", () => {
  test("getUsers는 성공하면 유저아이디와 accessToken, refreshToken을 반환하고 캐시에 refreshToken을 저장한다.", async () => {
    // given
    const userId = await userDB.save(new User({ email: "TestEmail" }));

    // when
    const res = await request(app).get("/users/TestEmail");

    // then
    expect(res.body.id).toBe(userId);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(await cache.get(`${"RefreshToken"}:${userId}`)).toEqual(
      expect.anything()
    );
  });

  test("getUsers는 없는 유저를 조회하면 500코드를 반환한다.", async () => {
    // when
    const res = await request(app).get("/users/TestEmail");

    // then
    expect(res.status).toBe(500);
  });
});

describe("postUsers", () => {
  test("postUsers는 성공하면 유저아이디와 accessToken, refreshToken을 반환하고 캐시에 refreshToken을 저장한다.", async () => {
    // when
    const res = await request(app).post("/users").send({ email: "TestEmail" });

    // then
    expect(res.body.id).toBeDefined();
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(await cache.get(`${"RefreshToken"}:${res.body.id}`)).toEqual(
      expect.anything()
    );
  });

  test("중복회원 가입은 409코드를 반환한다.", async () => {
    // given
    await userDB.save(new User({ email: "TestEmail" }));

    // when
    const res = await request(app).post("/users").send({ email: "TestEmail" });

    // then
    expect(res.status).toBe(409);
  });
});
