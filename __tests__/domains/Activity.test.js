const Activity = require("../../domains/Activity");

test("Activity set id & get id", () => {
  const activity = new Activity({ id: 1 });
  expect(activity.id).toBe(1);
});

test("Activity set name & get name", () => {
  const activity = new Activity({ name: "jaja" });
  expect(activity.name).toBe("jaja");
});

test("Activity set userId & get userId", () => {
  const activity = new Activity({ userId: 1 });
  expect(activity.userId).toBe(1);
});
