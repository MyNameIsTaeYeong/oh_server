const Activity = require("../../../domains/Activity");
const User = require("../../../domains/User");
require("../../../container");
const Container = require("typedi").Container;

let user;
const mySqlUserRepository = Container.get("UserRepository");
const mySqlActivityRepository = Container.get("ActivityRepository");

beforeAll(async () => {
  user = new User("test");
  user.id = await mySqlUserRepository.save(user);
});

afterAll(async () => {
  await mySqlUserRepository.clear();
});

afterEach(async () => {
  await mySqlActivityRepository.clear();
});

test("MySqlActivityRepository의 save()는 활동 아이디를 반환한다.", async () => {
  const activity = new Activity("운동", user.id);
  activity.id = await mySqlActivityRepository.save(activity);
  const expectedId = (await mySqlActivityRepository.findById(activity)).id;
  expect(expectedId).toBe(activity.id);
});

test("MySqlActivityRepository의 findAll()은 유저의 모든 활동을 반환한다.", async () => {
  const activity = new Activity("운동", user.id);
  activity.id = await mySqlActivityRepository.save(activity);
  const activity2 = new Activity("공부", user.id);
  activity2.id = await mySqlActivityRepository.save(activity2);

  const activities = await mySqlActivityRepository.findAll(user);

  expect(activities).toStrictEqual([
    { id: activity.id, name: activity.name, userId: activity.userId },
    { id: activity2.id, name: activity2.name, userId: activity2.userId },
  ]);
});

test("MySqlActivityRepository의 remove()은 해당 활동을 삭제한다.", async () => {
  const activity = new Activity("운동", user.id);
  activity.id = await mySqlActivityRepository.save(activity);
  await mySqlActivityRepository.remove(activity);
  const expected = await mySqlActivityRepository.findById(activity);
  expect(expected).toStrictEqual(undefined);
});
