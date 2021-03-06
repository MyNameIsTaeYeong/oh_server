const Emotion = require("../../domains/Emotion");

test("Emotion set id & get id", () => {
  const emotion = new Emotion({ id: 1 });

  expect(emotion.id).toBe(1);
});

test("Emotion set name & get name", () => {
  const emotion = new Emotion({ name: "jaja" });

  expect(emotion.name).toBe("jaja");
});

test("Emotion set userId & get userId", () => {
  const emotion = new Emotion({ userId: 1 });

  expect(emotion.userId).toBe(1);
});
