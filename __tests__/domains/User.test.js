const User = require("../../domains/User");

test("set id & get id", () => {
  const user = new User({ id: 1 });
  expect(user.id).toBe(1);
});

test("set email & get email", () => {
  const user = new User({ email: "jaja" });
  expect(user.email).toBe("jaja");
});

test("set email & get email", () => {
  const user = new User({ id: 1, email: "jaja" });
  expect(user.email).toBe("jaja");
  expect(user.id).toBe(1);
});
