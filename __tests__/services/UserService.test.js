const UserService = require("../../services/UserService");
require("../../container");
const Container = require("typedi").Container;

const userRepository = Container.get("UserRepository");

afterEach(async () => {
  await userRepository.clear();
});

test("회원가입에 성공하면 아이디를 반환한다.", async () => {
  const userService = Container.get("UserService");
  const userId = await userService.join({ email: "haha" });
  const selectedUser = await userRepository.findByEmail({ email: "haha" });
  expect(userId).toBe(selectedUser.id);
});

test("중복된 아이디는 에러를 발생시킨다", async () => {
  const userService = Container.get("UserService");
  await userService.join({ email: "haha" });
  expect(
    async () => await userService.join({ email: "haha" })
  ).rejects.toThrowError(new Error("이미 존재하는 회원입니다."));
});
