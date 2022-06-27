const app = require("../../app");
const request = require("supertest");
const { issueAtoken } = require("../../utilities");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const User = require("../../domains/User");
const MySqlShareTagRepository = require("../../repositories/mysql/MySqlShareTagRepository");
const ShareTag = require("../../domains/ShareTag");
require("../../container");
const Container = require("typedi").Container;
const userDB = new MySqlUserRepository(Container);
const shareTagDB = new MySqlShareTagRepository(Container);

let userId;

beforeAll(async () => {
  userId = await userDB.saveForTest(new User({ email: "TestEmail" }));
});

afterAll(async () => {
  await userDB.clear();
  await Container.get("cache").flushAll();
  Container.get("POOL").end();
  Container.get("cache").QUIT();
});

afterEach(async () => {
  await shareTagDB.clear();
});

describe("postShareTags", () => {
  test("postShareTags는 accessToken을 인증한 사용자에게 삽입된 테그 아이디를 반환해야 한다.", async () => {
    // given
    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .post("/sharetags")
      .set("authorization", accessToken)
      .send({ userId, content: "haha" });

    // then
    expect(res.status).toBe(200);
    expect(res.body.insertId).toBeDefined();
  });
});

describe("getShareTags", () => {
  test("getShareTags는 accessToken을 인증한 사용자에게 ShareTags를 반환한다.", async () => {
    // given
    const expected = [];

    await Promise.all([
      shareTagDB.save(new ShareTag({ content: "하하하", userId })).then((id) =>
        expected.push({
          id,
          content: "하하하",
          userId,
          likeCnt: 0,
          myLike: null,
        })
      ),
      shareTagDB.save(new ShareTag({ content: "호호호", userId })).then((id) =>
        expected.push({
          id,
          content: "호호호",
          userId,
          likeCnt: 0,
          myLike: null,
        })
      ),
      shareTagDB.save(new ShareTag({ content: "후후후", userId })).then((id) =>
        expected.push({
          id,
          content: "후후후",
          userId,
          likeCnt: 0,
          myLike: null,
        })
      ),
    ]);

    const accessToken = issueAtoken(userId, "access", "10s");

    //when
    const res = await request(app)
      .get(`/sharetags/${userId}?page=0`)
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(200);
    expect(res.body.results).toStrictEqual(expected);
  });
});
