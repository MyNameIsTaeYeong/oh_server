const User = require("../../domains/User");
const ArgumentError = require("../../errors/ArgumentError");
const UserService = require("../../services/UserService");

const Container = require("typedi").Container;

afterEach(async () => {
  Container.remove("UserRepository");
});

test("user의 email이 undefined이면 ArgumentError를 던진다.", async () => {
  Container.set("UserRepository", {});
  const userService = new UserService(Container);
  expect(async () => await userService.join(new User())).rejects.toThrowError(
    ArgumentError
  );
});

test("중복된 아이디는 에러를 발생시킨다", async () => {
  Container.set("UserRepository", {});
  const userService = new UserService(Container);
  const users = [{ email: "jaja" }, { email: "haha" }];
  const user = new User("haha");

  expect(
    async () => await userService.join({ users, user })
  ).rejects.toThrowError(new Error("이미 존재하는 회원입니다."));
});
