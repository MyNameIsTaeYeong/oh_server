const Activity = require("../../domains/Activity");
const User = require("../../domains/User");
const ArgumentError = require("../../errors/ArgumentError");
const RecordService = require("../../services/RecordService");
const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("RecordRepository");
});

describe("RecordService의 createRecord", () => {
  test("createRecord는 생성된 기록의 아이디를 반환한다.", async () => {
    // given
    const insertId = 1;
    Container.set("RecordRepository", {
      save: () => Promise.resolve(insertId),
    });
    const recordService = new RecordService(Container);

    // when
    const result = await recordService.createRecord(
      new Activity({ name: "test", userId: 1 })
    );

    // then
    expect(result).toBe(insertId);
  });
  test("record의 name이 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordRepository", {});
    const recordService = new RecordService(Container);

    const record = new Activity({});
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

    const record = new Activity({});
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

    const record = new Activity({});
    //record.id = 1;
    record.name = "ha";
    record.userId = 1;

    expect(
      async () => await recordService.deleteRecord(record)
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordService의 selectRecords", () => {
  test("selectRecords는 유저의 모든 기록을 반환한다.", async () => {
    // given
    Container.set("RecordRepository", {
      findAll: () => Promise.resolve([{ name: "기록1" }, { name: "기록2" }]),
    });
    const recordService = new RecordService(Container);

    // when
    const result = await recordService.selectRecords(new User({ id: 1 }));

    // then
    expect(result).toStrictEqual([{ name: "기록1" }, { name: "기록2" }]);
  });

  test("user의 id가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordRepository", {});
    const recordService = new RecordService(Container);

    const user = new User({});
    //user.id = 1;
    user.email = "ha";

    expect(
      async () => await recordService.selectRecords(user)
    ).rejects.toThrowError(ArgumentError);
  });
});
