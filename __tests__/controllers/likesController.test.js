const app = require("../../app");
const request = require("supertest");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const MySqlShareTagRepository = require("../../repositories/mysql/MySqlShareTagRepository");
const ShareTag = require("../../domains/ShareTag");
const { issueAtoken } = require("../../utilities");
const User = require("../../domains/User");
const MySqlLikeRepository = require("../../repositories/mysql/MySqlLikeRepository");

require("../../container");
const Container = require("typedi").Container;

const userDB = new MySqlUserRepository(Container);
const shareTagDB = new MySqlShareTagRepository(Container);
const likeDB = new MySqlLikeRepository(Container);

let userId;

beforeAll(
  async () => (userId = await userDB.saveForTest(new User({ email: "test" })))
);

afterAll(async () => {
  await userDB.clear();
  await Container.get("cache").flushAll();
  Container.get("POOL").end();
  Container.get("cache").QUIT();
});

describe("postLikes", () => {
  afterEach(async () => {
    await likeDB.clear();
    await shareTagDB.clear();
  });

  test("postLikes는 좋아요 내역을 추가하고 캐시에 좋아요 개수를 증가시킨다.", async () => {
    // given
    const tagId = await shareTagDB.save(
      new ShareTag({ content: "haha", userId })
    );

    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    const res = await request(app)
      .post("/likes")
      .send({ userId, tagId })
      .set("authorization", accessToken);

    // then
    expect(await Container.get("cache").get(`shareTag:${tagId}`)).toBe("1");
    expect((await likeDB.findByUserId(new User({ id: userId })))[0].tagId).toBe(
      tagId
    );
    expect(res.status).toBe(200);
  });

  test("postLikes는 중복 좋아요를 누르면 500코드를 반환한다.", async () => {
    // given
    const tagId = await shareTagDB.save(
      new ShareTag({ content: "haha", userId })
    );

    const accessToken = issueAtoken(userId, "access", "10s");

    // when
    await request(app)
      .post("/likes")
      .send({ userId, tagId })
      .set("authorization", accessToken);
    const res = await request(app)
      .post("/likes")
      .send({ userId, tagId })
      .set("authorization", accessToken);

    // then
    expect(res.status).toBe(500);
  });

  test("postLikes는 좋아요 내역을 추가하고, 캐시서버에서 에러가 발생하면 DB에 직접 좋아요 개수를 갱신한다.", async () => {
    // given
    const tagId = await shareTagDB.save(
      new ShareTag({ content: "haha", userId })
    );
    const accessToken = issueAtoken(userId, "access", "10s");
    Container.get("cache").set(`shareTag:${tagId}`, "일부러 에러 발생");

    // when
    const res = await request(app)
      .post("/likes")
      .send({ userId, tagId })
      .set("authorization", accessToken);

    // then
    expect(
      (await shareTagDB.findByUserId(new User({ id: userId })))[0].likeCnt
    ).toBe(1);
    expect((await likeDB.findByUserId(new User({ id: userId })))[0].tagId).toBe(
      tagId
    );
    expect(res.status).toBe(200);
  });
});
