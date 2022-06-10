const { masterPOOL: POOL } = require("../../db");
const Activity = require("../../domains/Activity");
const Emotion = require("../../domains/Emotion");
const User = require("../../domains/User");
const MySqlActivityOccurRepository = require("../../repositories/mysql/MySqlActivityOccurRepository");
const MySqlActivityRepository = require("../../repositories/mysql/MySqlActivityRepository");
const MySqlEmotionOccurRepository = require("../../repositories/mysql/MySqlEmotionOccurRepository");
const MySqlEmotionRepository = require("../../repositories/mysql/MySqlEmotionRepository");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const EmoOccurService = require("../../services/EmoOccurService");

let user;
const mySqlUserRepository = new MySqlUserRepository(POOL);
const emotionRepository = new MySqlEmotionRepository(POOL);
const activityRepository = new MySqlActivityRepository(POOL);
const emoOccurRepository = new MySqlEmotionOccurRepository(POOL);
const actOccurRepository = new MySqlActivityOccurRepository(POOL);
const emoOccurService = new EmoOccurService(
  emoOccurRepository,
  actOccurRepository
);

beforeAll(async () => {
  user = new User("test");
  user.id = await mySqlUserRepository.save(user);
});

afterAll(async () => {
  await mySqlUserRepository.clear();
});

afterEach(async () => {
  await actOccurRepository.clear();
  await emoOccurRepository.clear();
  await activityRepository.clear();
  await emotionRepository.clear();
});

test("emoOccurService의 selectRelatedEmoAndAct", async () => {
  const emotion = new Emotion("기쁨", user.id);
  emotion.id = await emotionRepository.save(emotion);

  const recordIds = [];

  recordIds.push(await activityRepository.save(new Activity("운동", user.id)));
  recordIds.push(await activityRepository.save(new Activity("숙면", user.id)));
  recordIds.push(await activityRepository.save(new Activity("빡공", user.id)));
  recordIds.push(await activityRepository.save(new Activity("독서", user.id)));
  recordIds.push(await activityRepository.save(new Activity("청소", user.id)));
  recordIds.push(await emotionRepository.save(new Emotion("화남", user.id)));
  recordIds.push(await emotionRepository.save(new Emotion("짜증", user.id)));

  await Promise.all([
    emoOccurRepository.saveForTest({
      emotionName: "기쁨",
      date: "2022-04-12 12:42:34",
      userId: user.id,
      recordId: emotion.id,
    }),
    emoOccurRepository.saveForTest({
      emotionName: "기쁨",
      date: "2022-04-08 10:42:34",
      userId: user.id,
      recordId: emotion.id,
    }),
    emoOccurRepository.saveForTest({
      emotionName: "기쁨",
      date: "2022-04-04 08:42:34",
      userId: user.id,
      recordId: emotion.id,
    }),
    actOccurRepository.saveForTest({
      activityName: "운동",
      userId: user.id,
      recordId: recordIds[0],
      date: "2022-04-04 15:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "운동",
      userId: user.id,
      recordId: recordIds[0],
      date: "2022-04-05 10:00:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "운동",
      userId: user.id,
      recordId: recordIds[0],
      date: "2022-04-06 10:10:20",
    }),
    actOccurRepository.saveForTest({
      activityName: "운동",
      userId: user.id,
      recordId: recordIds[0],
      date: "2022-04-09 13:02:04",
    }),
    actOccurRepository.saveForTest({
      activityName: "숙면",
      userId: user.id,
      recordId: recordIds[1],
      date: "2022-04-08 15:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "빡공",
      userId: user.id,
      recordId: recordIds[2],
      date: "2022-03-28 15:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "독서",
      userId: user.id,
      recordId: recordIds[3],
      date: "2022-04-30 15:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "청소",
      userId: user.id,
      recordId: recordIds[4],
      date: "2022-04-12 15:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "청소",
      userId: user.id,
      recordId: recordIds[4],
      date: "2022-04-08 10:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "화남",
      userId: user.id,
      recordId: recordIds[5],
      date: "2022-04-12 08:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "화남",
      userId: user.id,
      recordId: recordIds[5],
      date: "2022-04-15 08:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "화남",
      userId: user.id,
      recordId: recordIds[5],
      date: "2022-04-08 08:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "짜증",
      userId: user.id,
      recordId: recordIds[6],
      date: "2022-04-08 18:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "짜증",
      userId: user.id,
      recordId: recordIds[6],
      date: "2022-04-09 18:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "짜증",
      userId: user.id,
      recordId: recordIds[6],
      date: "2022-04-10 18:42:34",
    }),
  ]);

  expect(
    await emoOccurService.selectRelatedEmoAndAct(emotion, user)
  ).toStrictEqual([
    { 기쁨: 3, 화남: 2, 짜증: 1 },
    { 청소: 2, 운동: 1, 숙면: 1 },
  ]);
});
