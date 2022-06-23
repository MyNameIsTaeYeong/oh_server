const Activity = require("../../domains/Activity");
const ActOccur = require("../../domains/ActOccur");
const User = require("../../domains/User");
const ArgumentError = require("../../errors/ArgumentError");
const RecordOccurService = require("../../services/RecordOccurService");
const ActOccurService = require("../../services/RecordOccurService");
const Container = require("typedi").Container;

afterEach(async () => {
  Container.remove("RecordOccurRepository");
  Container.remove("RecordOccurRepository2");
});

describe("RecordOccurService의 createRecordOccur", () => {
  test("createRecordOccur는 생성된 레코드 아이디를 반환한다.", async () => {
    //given
    Container.set("RecordOccurRepository", { save: () => Promise.resolve(1) });
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);

    const recordOccur = new ActOccur({
      date: new Date(),
      userId: 1,
      recordId: 2,
      name: "haha",
    });

    //when
    const result = await recordOccurService.createRecordOccur({
      recordOccur,
    });

    //then
    expect(result).toBe(1);
  });
  test("recordOccur의 name이 없으면 ArgumentError를 던진다.", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur({
      date: new Date(),
      userId: 1,
      recordId: 2,
      //name: "haha",
    });

    // when
    // then
    expect(
      async () => await recordOccurService.createRecordOccur({ recordOccur })
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 userId가 없으면 ArgumentError를 던진다.", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur({
      date: new Date(),
      //userId: 1,
      recordId: 2,
      name: "haha",
    });

    // when
    // then
    expect(
      async () => await recordOccurService.createRecordOccur({ recordOccur })
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 recordId가 없으면 ArgumentError를 던진다.", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur({
      date: new Date(),
      userId: 1,
      //recordId: 2,
      name: "haha",
    });

    // when
    // then
    expect(
      async () => await recordOccurService.createRecordOccur({ recordOccur })
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 date가 없으면 ArgumentError를 던진다.", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});

    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur({
      //date: new Date(),
      userId: 1,
      recordId: 2,
      name: "haha",
    });

    // when
    // then
    expect(
      async () => await recordOccurService.createRecordOccur({ recordOccur })
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordOccurService의 selectRelatedRecords", () => {
  test("selectRelatedRecords는 해당 기록이 발생한 날들과 같이 발생했던 기록들의 개수를 리턴한다.", async () => {
    //given
    Container.set("RecordOccurRepository", {
      findByRecordId: (param) =>
        Promise.resolve([
          {
            name: "운동",
            date: "2022-04-12",
          },
          {
            name: "운동",
            date: "2022-04-08",
          },
          {
            name: "운동",
            date: "2022-04-04",
          },
        ]),
      findByUserId: (param) =>
        Promise.resolve([
          {
            name: "운동",
            date: "2022-04-12",
          },
          {
            name: "운동",
            date: "2022-04-08",
          },
          {
            name: "운동",
            date: "2022-04-04",
          },

          {
            name: "독서",
            date: "2022-04-12",
          },
          {
            name: "독서",
            date: "2022-04-15",
          },
          {
            name: "독서",
            date: "2022-04-08",
          },
          {
            name: "숙면",
            date: "2022-04-08",
          },
          {
            name: "숙면",
            date: "2022-04-09",
          },
          {
            name: "숙면",
            date: "2022-04-10",
          },
        ]),
    });

    Container.set("RecordOccurRepository2", {
      findByUserId: (param) =>
        Promise.resolve([
          {
            name: "기쁨",
            date: "2022-04-04",
          },
          {
            name: "기쁨",
            date: "2022-04-05",
          },
          {
            name: "기쁨",
            date: "2022-04-06",
          },
          {
            name: "기쁨",
            date: "2022-04-09",
          },
          {
            name: "슬픔",
            date: "2022-04-08",
          },
          {
            name: "짜증",
            date: "2022-03-28",
          },
          {
            name: "설렘",
            date: "2022-04-30",
          },
          {
            name: "화남",
            date: "2022-04-12",
          },
          {
            name: "화남",
            date: "2022-04-08",
          },
        ]),
    });

    //when
    const recordOccurService = new RecordOccurService(Container);
    const result = await recordOccurService.selectRelatedRecords({
      targetRecord: {},
      user: {},
    });

    //then
    expect(result).toStrictEqual([
      { 운동: 3, 독서: 2, 숙면: 1 },
      { 기쁨: 1, 슬픔: 1, 화남: 2 },
    ]);
  });

  test("selectRelatedRecords는 targetRecordOccur이 undefined면 빈 객체 2개를 리턴한다.", async () => {
    //given
    Container.set("RecordOccurRepository", {
      findByRecordId: (param) => Promise.resolve([]),
      findByUserId: (param) =>
        Promise.resolve([
          {
            name: "운동",
            date: "2022-04-12",
          },
          {
            name: "운동",
            date: "2022-04-08",
          },
          {
            name: "운동",
            date: "2022-04-04",
          },

          {
            name: "독서",
            date: "2022-04-12",
          },
          {
            name: "독서",
            date: "2022-04-15",
          },
          {
            name: "독서",
            date: "2022-04-08",
          },
          {
            name: "숙면",
            date: "2022-04-08",
          },
          {
            name: "숙면",
            date: "2022-04-09",
          },
          {
            name: "숙면",
            date: "2022-04-10",
          },
        ]),
    });

    Container.set("RecordOccurRepository2", {
      findByUserId: (param) =>
        Promise.resolve([
          {
            name: "기쁨",
            date: "2022-04-04",
          },
          {
            name: "기쁨",
            date: "2022-04-05",
          },
          {
            name: "기쁨",
            date: "2022-04-06",
          },
          {
            name: "기쁨",
            date: "2022-04-09",
          },
          {
            name: "슬픔",
            date: "2022-04-08",
          },
          {
            name: "짜증",
            date: "2022-03-28",
          },
          {
            name: "설렘",
            date: "2022-04-30",
          },
          {
            name: "화남",
            date: "2022-04-12",
          },
          {
            name: "화남",
            date: "2022-04-08s",
          },
        ]),
    });

    // when
    const recordOccurService = new RecordOccurService(Container);
    const result = await recordOccurService.selectRelatedRecords({
      targetRecord: {},
      user: {},
    });

    expect(result).toStrictEqual([{}, {}]);
  });
});

describe("RecordOccurService의 deleteRecordOccur", () => {
  test("recordOccur의 id가 없으면 ArgumentError를 던진다", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});

    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur({
      //id: 1,
      date: "asd",
      name: "haha",
      userId: 1,
      recordId: 1,
    });

    // when, then
    expect(
      async () => await recordOccurService.deleteRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 name이 없으면 ArgumentError를 던진다", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur({
      id: 1,
      date: "asd",
      //name: "haha",
      userId: 1,
      recordId: 1,
    });

    // when, then
    expect(
      async () => await recordOccurService.deleteRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 userId가 없으면 ArgumentError를 던진다", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur({
      id: 1,
      date: "asd",
      name: "haha",
      //userId: 1,
      recordId: 1,
    });

    // when, then
    expect(
      async () => await recordOccurService.deleteRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 recordId가 없으면 ArgumentError를 던진다", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur({
      id: 1,
      date: "asd",
      name: "haha",
      userId: 1,
      //recordId: 1,
    });

    // when, then
    expect(
      async () => await recordOccurService.deleteRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordOccurService의 selectRecordOccurByUserId", () => {
  test("user.id가 없으면 ArgumentError를 던진다.", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const user = new User({ email: "haha" });

    // when, then
    expect(
      async () => await recordOccurService.selectRecordOccurByUserId(user)
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordOccurService의 selectRecordOccurByRecordId", () => {
  test("record의 id가 없으면 ArgumentError를 던진다.", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const record = new Activity({
      //id: 1,
      name: "ja",
      userId: 1,
    });

    // when, then
    expect(
      async () => await recordOccurService.selectRecordOccurByRecordId(record)
    ).rejects.toThrowError(ArgumentError);
  });

  test("record의 name이 없으면 ArgumentError를 던진다.", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const record = new Activity({
      id: 1,
      //name: "ja",
      userId: 1,
    });
    // when, then
    expect(
      async () => await recordOccurService.selectRecordOccurByRecordId(record)
    ).rejects.toThrowError(ArgumentError);
  });

  test("record의 userId가 없으면 ArgumentError를 던진다.", async () => {
    // given
    Container.set("RecordOccurRepository", {});
    Container.set("RecordOccurRepository2", {});
    const recordOccurService = new RecordOccurService(Container);
    const record = new Activity({
      id: 1,
      name: "ja",
      //userId: 1,
    });

    // when, then
    expect(
      async () => await recordOccurService.selectRecordOccurByRecordId(record)
    ).rejects.toThrowError(ArgumentError);
  });
});
