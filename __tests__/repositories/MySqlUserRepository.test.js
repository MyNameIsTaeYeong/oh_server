const { masterPOOL: POOL } = require("../../db");
const MySqlUserRepository = require("../../repositories/MySqlUserRepository");

const mySqlUserRepository = new MySqlUserRepository(POOL);

afterEach(async () => await mySqlUserRepository.remove({ email: "test" }));

test("MySqlUserRepo save()는 성공하면 유저아이디를 반환한다.", async () => {
  const userId = await mySqlUserRepository.save({ email: "test" });
  const selectedUser = await mySqlUserRepository.findByEmail({ email: "test" });

  expect(userId).toBe(selectedUser.id);
});
