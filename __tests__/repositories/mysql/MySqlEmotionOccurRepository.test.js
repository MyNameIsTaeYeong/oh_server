const EmoOccur = require("../../../domains/EmoOccur");
const Emotion = require("../../../domains/Emotion");
const User = require("../../../domains/User");
require("../../../container");
const Container = require("typedi").Container;

let user;
let emotion;
const mySqlUserRepository = Container.get("UserRepository");
const mySqlEmotionRepository = Container.get("EmotionRepository");
const mySqlEmoOccurRepository = Container.get("EmotionOccurRepository");

beforeAll(async () => {
  user = new User("test");
  user.id = await mySqlUserRepository.save(user);
  emotion = new Emotion("기쁨", user.id);
  emotion.id = await mySqlEmotionRepository.save(emotion);
});

afterAll(async () => {
  await mySqlUserRepository.clear();
  await mySqlEmotionRepository.clear();
});

afterEach(async () => {
  await mySqlEmoOccurRepository.clear();
});

test("MySqlEmotionOccurRepository save()는 삽입된 아이디를 반환한다.", async () => {
  const emoOccur = new EmoOccur();
  emoOccur.name = emotion.name;
  emoOccur.userId = user.id;
  emoOccur.recordId = emotion.id;
  emoOccur.id = await mySqlEmoOccurRepository.save(emoOccur);
  const expectedId = (await mySqlEmoOccurRepository.findById(emoOccur)).id;
  expect(expectedId).toBe(emoOccur.id);
});
test("MySqlEmotionOccurRepository remove()는 해당 기록을 삭제한다.", async () => {
  const emoOccur = new EmoOccur();
  emoOccur.name = emotion.name;
  emoOccur.userId = user.id;
  emoOccur.recordId = emotion.id;
  emoOccur.id = await mySqlEmoOccurRepository.save(emoOccur);
  await mySqlEmoOccurRepository.remove(emoOccur);

  expect(await mySqlEmoOccurRepository.findById(emoOccur)).toBeUndefined();
});

test("MySqlEmotionOccurRepository findByUserId()는 유저의 모든 기록을 반환한다.", async () => {
  const emoOccur = new EmoOccur();
  emoOccur.name = emotion.name;
  emoOccur.userId = user.id;
  emoOccur.recordId = emotion.id;
  emoOccur.id = await mySqlEmoOccurRepository.save(emoOccur);

  const emoOccur2 = new EmoOccur();
  emoOccur2.name = emotion.name;
  emoOccur2.userId = user.id;
  emoOccur2.recordId = emotion.id;
  emoOccur2.id = await mySqlEmoOccurRepository.save(emoOccur2);

  const expected = await mySqlEmoOccurRepository.findByUserId(user);
  expect(expected.length).toBe(2);
});
test("MySqlEmotionOccurRepository findByRecordId()는 해당 활동의 기록을 반환한다.", async () => {
  const emoOccur = new EmoOccur();
  emoOccur.name = emotion.name;
  emoOccur.userId = user.id;
  emoOccur.recordId = emotion.id;
  emoOccur.id = await mySqlEmoOccurRepository.save(emoOccur);

  const emoOccur2 = new EmoOccur();
  emoOccur2.name = emotion.name;
  emoOccur2.userId = user.id;
  emoOccur2.recordId = emotion.id;
  emoOccur2.id = await mySqlEmoOccurRepository.save(emoOccur2);

  const expected = await mySqlEmoOccurRepository.findByRecordId(emotion);

  expect(expected.length).toBe(2);
});
