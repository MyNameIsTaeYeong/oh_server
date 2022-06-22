const EmoOccur = require("../../domains/EmoOccur");

test("EmoOccur set id & get id", () => {
  const emoOccur = new EmoOccur({ id: 1 });

  expect(emoOccur.id).toBe(1);
});

test("EmoOccur set date & get date", () => {
  const emoOccur = new EmoOccur({ date: 1 });

  expect(emoOccur.date).toBe(1);
});

test("EmoOccur set name & get name", () => {
  const emoOccur = new EmoOccur({ name: "jaja" });

  expect(emoOccur.name).toBe("jaja");
});

test("EmoOccur set userId & get userId", () => {
  const emoOccur = new EmoOccur({ userId: 1 });

  expect(emoOccur.userId).toBe(1);
});

test("EmoOccur set recordId & get recordId", () => {
  const emoOccur = new EmoOccur({ recordId: 1 });

  expect(emoOccur.recordId).toBe(1);
});
