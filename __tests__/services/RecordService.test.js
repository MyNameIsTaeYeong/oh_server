const Activity = require("../../domains/Activity");
const User = require("../../domains/User");
const ArgumentError = require("../../errors/ArgumentError");
const RecordService = require("../../services/RecordService");
const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("RecordRepository");
});

describe("RecordService의 createRecord", () => {
  test("record의 name이 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordRepository", {});
    const recordService = new RecordService(Container);

    const record = new Activity();
    record.id = 1;
    //record.name="ha";
    record.userId = 1;

    expect(
      async () => await recordService.createRecord(record)
    ).rejects.toThrowError(ArgumentError);
  });

  test("record의 userId가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordRepository", {});
    const recordService = new RecordService(Container);

    const record = new Activity();
    record.id = 1;
    record.name = "ha";
    //record.userId = 1;

    expect(
      async () => await recordService.createRecord(record)
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordService의 deleteRecord", () => {
  test("record의 id가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordRepository", {});
    const recordService = new RecordService(Container);

    const record = new Activity();
    //record.id = 1;
    record.name = "ha";
    record.userId = 1;

    expect(
      async () => await recordService.deleteRecord(record)
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordService의 selectRecords", () => {
  test("user의 id가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordRepository", {});
    const recordService = new RecordService(Container);

    const user = new User();
    //user.id = 1;
    user.email = "ha";

    expect(
      async () => await recordService.selectRecords(user)
    ).rejects.toThrowError(ArgumentError);
  });
});
