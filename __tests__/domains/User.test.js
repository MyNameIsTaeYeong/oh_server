const User = require("../../domains/User");

test("set id & get id", () => {
  const user = new User();
  user.id = 1;
  expect(user.id).toBe(1);
});

test("set email & get email", () => {
  const user = new User();
  user.email = "jaja";
  expect(user.email).toBe("jaja");
});
