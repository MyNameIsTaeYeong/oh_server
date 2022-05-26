const { masterPOOL: POOL } = require("../../db");
const Emotion = require("../../domains/Emotion");
const User = require("../../domains/User");
const MySqlEmotionRepository = require("../../repositories/MySqlEmotionRepository");
const MySqlUserRepository = require("../../repositories/MySqlUserRepository");

let user;
const mySqlUserRepository = new MySqlUserRepository(POOL);
const mySqlEmotionRepository = new MySqlEmotionRepository(POOL);

beforeAll(async () => {
  user = new User("test");
  user.id = await mySqlUserRepository.save(user);
});

afterAll(async () => {
  await mySqlUserRepository.clear();
});

afterEach(async () => {
  await mySqlEmotionRepository.clear();
});

test("MySqlEmotionRepository의 save()는 활동 아이디를 반환한다.", async () => {
  const emotion = new Emotion("기쁨", user.id);
  emotion.id = await mySqlEmotionRepository.save(emotion);
  const expectedId = (await mySqlEmotionRepository.findById(emotion)).id;
  expect(expectedId).toBe(emotion.id);
});

test("MySqlEmotionRepository의 findAll()은 유저의 모든 활동을 반환한다.", async () => {
  const emotion = new Emotion("기쁨", user.id);
  emotion.id = await mySqlEmotionRepository.save(emotion);
  const emotion2 = new Emotion("슬픔", user.id);
  emotion2.id = await mySqlEmotionRepository.save(emotion2);

  const emotions = await mySqlEmotionRepository.findAll(user);

  expect(emotions).toStrictEqual([
    { id: emotion.id, name: emotion.name, userId: emotion.userId },
    { id: emotion2.id, name: emotion2.name, userId: emotion2.userId },
  ]);
});

test("MySqlEmotionRepository의 remove()은 해당 활동을 삭제한다.", async () => {
  const emotion = new Emotion("기쁨", user.id);
  emotion.id = await mySqlEmotionRepository.save(emotion);
  await mySqlEmotionRepository.remove(emotion);
  const expected = await mySqlEmotionRepository.findById(emotion);
  expect(expected).toStrictEqual(undefined);
});
