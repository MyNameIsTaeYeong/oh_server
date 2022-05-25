const { masterPOOL: POOL } = require("../../db");
const Activity = require("../../domains/Activity");
const User = require("../../domains/User");
const MySqlActivityRepository = require("../../repositories/MySqlActivityRepository");
const MySqlUserRepository = require("../../repositories/MySqlUserRepository");
const ActivityService = require("../../services/ActivityService");

let user;
const mySqlUserRepository = new MySqlUserRepository(POOL);
const activityRepository = new MySqlActivityRepository(POOL);
const activityService = new ActivityService(activityRepository);

beforeAll(async () => {
  user = new User("test");
  user.id = await mySqlUserRepository.save(user);
});

afterAll(async () => {
  await mySqlUserRepository.clear();
});

afterEach(async () => {
  await activityRepository.clear();
});

test("ActivityService의 createActivity는 생성된 활동아이디를 반환한다.", async () => {
  const activity = new Activity("운동", user.id);
  activity.id = await activityService.createActivity(activity);
  expectedId = (await activityRepository.findById(activity)).id;
  expect(activity.id).toBe(expectedId);
});

test("ActivityService의 deleteActivity는 유저의 활동을 삭제한다.", async () => {
  const activity = new Activity("운동", user.id);
  activity.id = await activityService.createActivity(activity);
  await activityService.deleteActivity(activity);
  const expected = await activityRepository.findById(activity);
  expect(expected).toBeUndefined();
});
