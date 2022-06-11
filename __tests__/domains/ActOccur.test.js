const ActOccur = require("../../domains/ActOccur");

test("ActOccur set id & get id", () => {
  const actOccur = new ActOccur();
  actOccur.id = 1;
  expect(actOccur.id).toBe(1);
});

test("ActOccur set date & get date", () => {
  const actOccur = new ActOccur();
  actOccur.date = 1;
  expect(actOccur.date).toBe(1);
});

test("ActOccur set name & get name", () => {
  const actOccur = new ActOccur();
  actOccur.name = "jaja";
  expect(actOccur.name).toBe("jaja");
});

test("ActOccur set userId & get userId", () => {
  const actOccur = new ActOccur();
  actOccur.userId = 1;
  expect(actOccur.userId).toBe(1);
});

test("ActOccur set recordId & get recordId", () => {
  const actOccur = new ActOccur();
  actOccur.recordId = 1;
  expect(actOccur.recordId).toBe(1);
});
