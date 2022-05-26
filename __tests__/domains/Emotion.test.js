const Emotion = require("../../domains/Emotion");

test("set id & get id", () => {
  const emotion = new Emotion();
  emotion.id = 1;
  expect(emotion.id).toBe(1);
});

test("set name & get name", () => {
  const emotion = new Emotion();
  emotion.name = "jaja";
  expect(emotion.name).toBe("jaja");
});

test("set userId & get userId", () => {
  const emotion = new Emotion();
  emotion.userId = 1;
  expect(emotion.userId).toBe(1);
});
