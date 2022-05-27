const { masterPOOL: POOL } = require("../../db");
const Activity = require("../../domains/Activity");
const ActOccur = require("../../domains/ActOccur");
const User = require("../../domains/User");
const MySqlActivityOccurRepository = require("../../repositories/MySqlActivityOccurRepository");
const MySqlActivityRepository = require("../../repositories/MySqlActivityRepository");
const MySqlUserRepository = require("../../repositories/MySqlUserRepository");

let user;
let activity;
const mySqlUserRepository = new MySqlUserRepository(POOL);
const mySqlActivityRepository = new MySqlActivityRepository(POOL);
const mySqlActOccurRepository = new MySqlActivityOccurRepository(POOL);

beforeAll(async () => {
  user = new User("test");
  user.id = await mySqlUserRepository.save(user);
  activity = new Activity("운동", user.id);
  activity.id = await mySqlActivityRepository.save(activity);
});

afterAll(async () => {
  await mySqlUserRepository.clear();
  await mySqlActivityRepository.clear();
});

afterEach(async () => {
  await mySqlActOccurRepository.clear();
});

test("MySqlActivityOccurRepository의 save()는 삽입된 아이디를 반환한다.", async () => {
  const actOccur = new ActOccur();
  actOccur.name = activity.name;
  actOccur.userId = user.id;
  actOccur.recordId = activity.id;
  actOccur.id = await mySqlActOccurRepository.save(actOccur);
  const expectedId = (await mySqlActOccurRepository.findById(actOccur)).id;
  expect(expectedId).toBe(actOccur.id);
});
test("MySqlActivityOccurRepository의 remove()는 해당 기록을 삭제한다.", async () => {
  const actOccur = new ActOccur();
  actOccur.name = activity.name;
  actOccur.userId = user.id;
  actOccur.recordId = activity.id;
  actOccur.id = await mySqlActOccurRepository.save(actOccur);
  await mySqlActOccurRepository.remove(actOccur);

  expect(await mySqlActOccurRepository.findById(actOccur)).toBeUndefined();
});

test("MySqlActivityOccurRepository의 findByUserId()는 유저의 모든 기록을 반환한다.", async () => {
  const actOccur = new ActOccur();
  actOccur.name = activity.name;
  actOccur.userId = user.id;
  actOccur.recordId = activity.id;
  actOccur.id = await mySqlActOccurRepository.save(actOccur);

  const actOccur2 = new ActOccur();
  actOccur2.name = activity.name;
  actOccur2.userId = user.id;
  actOccur2.recordId = activity.id;
  actOccur2.id = await mySqlActOccurRepository.save(actOccur2);

  const expected = await mySqlActOccurRepository.findByUserId(user);
  expect(expected.length).toBe(2);
});
test("MySqlActivityOccurRepository의 findByRecordId()는 해당 활동의 기록을 반환한다.", async () => {
  const actOccur = new ActOccur();
  actOccur.name = activity.name;
  actOccur.userId = user.id;
  actOccur.recordId = activity.id;
  actOccur.id = await mySqlActOccurRepository.save(actOccur);

  const actOccur2 = new ActOccur();
  actOccur2.name = activity.name;
  actOccur2.userId = user.id;
  actOccur2.recordId = activity.id;
  actOccur2.id = await mySqlActOccurRepository.save(actOccur2);

  const expected = await mySqlActOccurRepository.findByRecordId(activity);

  expect(expected.length).toBe(2);
});
