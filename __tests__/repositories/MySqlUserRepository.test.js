const { masterPOOL: POOL } = require("../../db");
const MySqlUserRepository = require("../../repositories/MySqlUserRepository");

const mySqlUserRepository = new MySqlUserRepository(POOL);

afterEach(async () => await mySqlUserRepository.clear());

test("MySqlUserRepo save()는 유저아이디를 반환한다.", async () => {
  const userId = await mySqlUserRepository.save({ email: "test" });
  const selectedUser = await mySqlUserRepository.findByEmail({ email: "test" });

  expect(userId).toBe(selectedUser.id);
});

test("MySqlUserRepo save()는 유저아이디를 반환한다.", async () => {
  const userId = await mySqlUserRepository.save({ email: "test" });
  const selectedUser = await mySqlUserRepository.findById({ id: userId });

  expect(selectedUser.email).toBe("test");
});

test("MySqlUserRepo findAll()는 모든 유저를 반환한다.", async () => {
  const userId1 = await mySqlUserRepository.save({ email: "test" });
  const userId2 = await mySqlUserRepository.save({ email: "test2" });

  const userList = await mySqlUserRepository.findAll();

  expect(userList).toStrictEqual([
    { email: "test", id: userId1 },
    { email: "test2", id: userId2 },
  ]);
});
