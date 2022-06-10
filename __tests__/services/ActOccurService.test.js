const { masterPOOL: POOL } = require("../../db");
const Activity = require("../../domains/Activity");
const Emotion = require("../../domains/Emotion");
const User = require("../../domains/User");
const MySqlActivityOccurRepository = require("../../repositories/mysql/MySqlActivityOccurRepository");
const MySqlActivityRepository = require("../../repositories/mysql/MySqlActivityRepository");
const MySqlEmotionOccurRepository = require("../../repositories/mysql/MySqlEmotionOccurRepository");
const MySqlEmotionRepository = require("../../repositories/mysql/MySqlEmotionRepository");
const MySqlUserRepository = require("../../repositories/mysql/MySqlUserRepository");
const ActOccurService = require("../../services/ActOccurService");

let user;
const mySqlUserRepository = new MySqlUserRepository(POOL);
const emotionRepository = new MySqlEmotionRepository(POOL);
const activityRepository = new MySqlActivityRepository(POOL);
const emoOccurRepository = new MySqlEmotionOccurRepository(POOL);
const actOccurRepository = new MySqlActivityOccurRepository(POOL);
const actOccurService = new ActOccurService(
  actOccurRepository,
  emoOccurRepository
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

test("actOccurService의 selectRelatedActAndEmo", async () => {
  const activity = new Activity("운동", user.id);
  activity.id = await activityRepository.save(activity);

  const recordIds = [];

  recordIds.push(await emotionRepository.save(new Emotion("기쁨", user.id)));
  recordIds.push(await emotionRepository.save(new Emotion("슬픔", user.id)));
  recordIds.push(await emotionRepository.save(new Emotion("짜증", user.id)));
  recordIds.push(await emotionRepository.save(new Emotion("설렘", user.id)));
  recordIds.push(await emotionRepository.save(new Emotion("화남", user.id)));
  recordIds.push(await activityRepository.save(new Activity("독서", user.id)));
  recordIds.push(await activityRepository.save(new Activity("숙면", user.id)));

  await Promise.all([
    actOccurRepository.saveForTest({
      activityName: "운동",
      date: "2022-04-12 12:42:34",
      userId: user.id,
      recordId: activity.id,
    }),
    actOccurRepository.saveForTest({
      activityName: "운동",
      date: "2022-04-08 10:42:34",
      userId: user.id,
      recordId: activity.id,
    }),
    actOccurRepository.saveForTest({
      activityName: "운동",
      date: "2022-04-04 08:42:34",
      userId: user.id,
      recordId: activity.id,
    }),
    emoOccurRepository.saveForTest({
      emotionName: "기쁨",
      userId: user.id,
      recordId: recordIds[0],
      date: "2022-04-04 15:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "기쁨",
      userId: user.id,
      recordId: recordIds[0],
      date: "2022-04-05 10:00:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "기쁨",
      userId: user.id,
      recordId: recordIds[0],
      date: "2022-04-06 10:10:20",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "기쁨",
      userId: user.id,
      recordId: recordIds[0],
      date: "2022-04-09 13:02:04",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "슬픔",
      userId: user.id,
      recordId: recordIds[1],
      date: "2022-04-08 15:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "짜증",
      userId: user.id,
      recordId: recordIds[2],
      date: "2022-03-28 15:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "설렘",
      userId: user.id,
      recordId: recordIds[3],
      date: "2022-04-30 15:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "화남",
      userId: user.id,
      recordId: recordIds[4],
      date: "2022-04-12 15:42:34",
    }),
    emoOccurRepository.saveForTest({
      emotionName: "화남",
      userId: user.id,
      recordId: recordIds[4],
      date: "2022-04-08 10:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "독서",
      userId: user.id,
      recordId: recordIds[5],
      date: "2022-04-12 08:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "독서",
      userId: user.id,
      recordId: recordIds[5],
      date: "2022-04-15 08:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "독서",
      userId: user.id,
      recordId: recordIds[5],
      date: "2022-04-08 08:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "숙면",
      userId: user.id,
      recordId: recordIds[6],
      date: "2022-04-08 18:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "숙면",
      userId: user.id,
      recordId: recordIds[6],
      date: "2022-04-09 18:42:34",
    }),
    actOccurRepository.saveForTest({
      activityName: "숙면",
      userId: user.id,
      recordId: recordIds[6],
      date: "2022-04-10 18:42:34",
    }),
  ]);

  expect(
    await actOccurService.selectRelatedActAndEmo(activity, user)
  ).toStrictEqual([
    { 기쁨: 1, 슬픔: 1, 화남: 2 },
    { 독서: 2, 숙면: 1, 운동: 3 },
  ]);
});
