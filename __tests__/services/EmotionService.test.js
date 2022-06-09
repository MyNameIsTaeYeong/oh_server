const { masterPOOL: POOL } = require("../../db");
const Emotion = require("../../domains/Emotion");

const User = require("../../domains/User");
const MySqlEmotionRepository = require("../../repositories/mysql/MySqlEmotionRepository");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const EmotionService = require("../../services/EmotionService");

let user;
const mySqlUserRepository = new MySqlUserRepository(POOL);
const emotionRepository = new MySqlEmotionRepository(POOL);
const emotionService = new EmotionService(emotionRepository);

beforeAll(async () => {
  user = new User("test");
  user.id = await mySqlUserRepository.save(user);
});

afterAll(async () => {
  await mySqlUserRepository.clear();
});

afterEach(async () => {
  await emotionRepository.clear();
});

test("EmotionService의 createEmotion는 생성된 감정 아이디를 반환한다.", async () => {
  const emotion = new Emotion("기쁨", user.id);
  emotion.id = await emotionService.createEmotion(emotion);
  expectedId = (await emotionRepository.findById(emotion)).id;
  expect(emotion.id).toBe(expectedId);
});

test("EmotionService의 deleteEmotion는 유저의 활동을 삭제한다.", async () => {
  const emotion = new Emotion("기쁨", user.id);
  emotion.id = await emotionService.createEmotion(emotion);
  await emotionService.deleteEmotion(emotion);
  const expected = await emotionRepository.findById(emotion);
  expect(expected).toBeUndefined();
});

test("EmotionService의 selectEmotions는 활동들을 반환한다.", async () => {
  const emotion = new Emotion("기쁨", user.id);
  emotion.id = await emotionService.createEmotion(emotion);

  const emotion2 = new Emotion("기쁨2", user.id);
  emotion2.id = await emotionService.createEmotion(emotion2);

  const emotions = await emotionService.selectEmotions(user);

  expect(emotions).toStrictEqual([
    { id: emotion.id, name: "기쁨", userId: user.id },
    { id: emotion2.id, name: "기쁨2", userId: user.id },
  ]);
});
