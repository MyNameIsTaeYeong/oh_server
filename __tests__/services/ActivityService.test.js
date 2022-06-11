const Activity = require("../../domains/Activity");
const User = require("../../domains/User");
require("../../container");
const Container = require("typedi").Container;

let user;
const mySqlUserRepository = Container.get("UserRepository");
const activityRepository = Container.get("ActivityRepository");
const activityService = Container.get("ActivityService");

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

test("ActivityService의 selectActivities는 활동들을 반환한다.", async () => {
  const activity = new Activity("운동", user.id);
  activity.id = await activityService.createActivity(activity);

  const activity2 = new Activity("운동2", user.id);
  activity2.id = await activityService.createActivity(activity2);

  const activities = await activityService.selectActivities(user);

  expect(activities).toStrictEqual([
    { id: activity.id, name: "운동", userId: user.id },
    { id: activity2.id, name: "운동2", userId: user.id },
  ]);
});
