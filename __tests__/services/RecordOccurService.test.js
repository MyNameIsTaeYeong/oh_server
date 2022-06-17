const Activity = require("../../domains/Activity");
const ActOccur = require("../../domains/ActOccur");
const User = require("../../domains/User");
const ArgumentError = require("../../errors/ArgumentError");
const RecordOccurService = require("../../services/RecordOccurService");
const ActOccurService = require("../../services/RecordOccurService");
const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("RecordOccurRepository");
});

describe("RecordOccurService의 selectRelatedEmoAndAct", () => {
  test("selectRelatedEmoAndAct는 해당 기록이 발생한 날들과 같이 발생했던 감정, 활동의 개수를 리턴한다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);

    const targetRecordOccurs = [
      {
        activityName: "운동",
        date: new Date("2022-04-12 12:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-08 10:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-04 08:42:34"),
      },
    ];

    const emoOccursOfUser = [
      {
        emotionName: "기쁨",
        date: new Date("2022-04-04 15:42:34"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-05 10:00:34"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-06 10:10:20"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-09 13:02:04"),
      },
      {
        emotionName: "슬픔",
        date: new Date("2022-04-08 15:42:34"),
      },
      {
        emotionName: "짜증",
        date: new Date("2022-03-28 15:42:34"),
      },
      {
        emotionName: "설렘",
        date: new Date("2022-04-30 15:42:34"),
      },
      {
        emotionName: "화남",
        date: new Date("2022-04-12 15:42:34"),
      },
      {
        emotionName: "화남",
        date: new Date("2022-04-08 10:42:34"),
      },
    ];
    const actOccursOfUser = [
      {
        activityName: "운동",
        date: new Date("2022-04-12 12:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-08 10:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-04 08:42:34"),
      },

      {
        activityName: "독서",
        date: new Date("2022-04-12 08:42:34"),
      },
      {
        activityName: "독서",
        date: new Date("2022-04-15 08:42:34"),
      },
      {
        activityName: "독서",
        date: new Date("2022-04-08 08:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-08 18:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-09 18:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-10 18:42:34"),
      },
    ];

    expect(
      recordOccurService.selectRelatedEmoAndAct({
        targetRecordOccurs,
        emoOccursOfUser,
        actOccursOfUser,
      })
    ).toStrictEqual([
      { 기쁨: 1, 슬픔: 1, 화남: 2 },
      { 운동: 3, 독서: 2, 숙면: 1 },
    ]);
  });

  test("selectRelatedEmoAndAct는 targetRecordOccurs가 undefined면 빈 객체 2개를 리턴한다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);

    const emoOccursOfUser = [
      {
        emotionName: "기쁨",
        date: new Date("2022-04-04 15:42:34"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-05 10:00:34"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-06 10:10:20"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-09 13:02:04"),
      },
      {
        emotionName: "슬픔",
        date: new Date("2022-04-08 15:42:34"),
      },
      {
        emotionName: "짜증",
        date: new Date("2022-03-28 15:42:34"),
      },
      {
        emotionName: "설렘",
        date: new Date("2022-04-30 15:42:34"),
      },
      {
        emotionName: "화남",
        date: new Date("2022-04-12 15:42:34"),
      },
      {
        emotionName: "화남",
        date: new Date("2022-04-08 10:42:34"),
      },
    ];
    const actOccursOfUser = [
      {
        activityName: "운동",
        date: new Date("2022-04-12 12:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-08 10:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-04 08:42:34"),
      },

      {
        activityName: "독서",
        date: new Date("2022-04-12 08:42:34"),
      },
      {
        activityName: "독서",
        date: new Date("2022-04-15 08:42:34"),
      },
      {
        activityName: "독서",
        date: new Date("2022-04-08 08:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-08 18:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-09 18:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-10 18:42:34"),
      },
    ];

    expect(
      recordOccurService.selectRelatedEmoAndAct({
        emoOccursOfUser,
        actOccursOfUser,
      })
    ).toStrictEqual([{}, {}]);
  });

  test("selectRelatedEmoAndAct는 emoOccursOfUser가 undefined면 연관 활동만 리턴한다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);

    const targetRecordOccurs = [
      {
        activityName: "운동",
        date: new Date("2022-04-12 12:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-08 10:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-04 08:42:34"),
      },
    ];

    const actOccursOfUser = [
      {
        activityName: "운동",
        date: new Date("2022-04-12 12:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-08 10:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-04 08:42:34"),
      },

      {
        activityName: "독서",
        date: new Date("2022-04-12 08:42:34"),
      },
      {
        activityName: "독서",
        date: new Date("2022-04-15 08:42:34"),
      },
      {
        activityName: "독서",
        date: new Date("2022-04-08 08:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-08 18:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-09 18:42:34"),
      },
      {
        activityName: "숙면",
        date: new Date("2022-04-10 18:42:34"),
      },
    ];

    expect(
      recordOccurService.selectRelatedEmoAndAct({
        targetRecordOccurs,
        actOccursOfUser,
      })
    ).toStrictEqual([{}, { 운동: 3, 독서: 2, 숙면: 1 }]);
  });

  test("selectRelatedEmoAndAct는 actOccursOfUser가 undefined면 연관 감정만 리턴한다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);

    const targetRecordOccurs = [
      {
        activityName: "운동",
        date: new Date("2022-04-12 12:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-08 10:42:34"),
      },
      {
        activityName: "운동",
        date: new Date("2022-04-04 08:42:34"),
      },
    ];

    const emoOccursOfUser = [
      {
        emotionName: "기쁨",
        date: new Date("2022-04-04 15:42:34"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-05 10:00:34"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-06 10:10:20"),
      },
      {
        emotionName: "기쁨",
        date: new Date("2022-04-09 13:02:04"),
      },
      {
        emotionName: "슬픔",
        date: new Date("2022-04-08 15:42:34"),
      },
      {
        emotionName: "짜증",
        date: new Date("2022-03-28 15:42:34"),
      },
      {
        emotionName: "설렘",
        date: new Date("2022-04-30 15:42:34"),
      },
      {
        emotionName: "화남",
        date: new Date("2022-04-12 15:42:34"),
      },
      {
        emotionName: "화남",
        date: new Date("2022-04-08 10:42:34"),
      },
    ];

    expect(
      recordOccurService.selectRelatedEmoAndAct({
        targetRecordOccurs,
        emoOccursOfUser,
      })
    ).toStrictEqual([{ 기쁨: 1, 슬픔: 1, 화남: 2 }, {}]);
  });
});

describe("RecordOccurService의 createRecordOccur", () => {
  test("recordOccur의 name이 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur();
    recordOccur.id = 1;
    recordOccur.date = "asd";
    recordOccur.userId = 1;
    recordOccur.recordId = 1;
    expect(
      async () => await recordOccurService.createRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 userId가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur();
    recordOccur.id = 1;
    recordOccur.date = "asd";
    recordOccur.name = "haha";
    //recordOccur.userId = 1;
    recordOccur.recordId = 1;
    expect(
      async () => await recordOccurService.createRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 recordId가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur();
    recordOccur.id = 1;
    recordOccur.date = "asd";
    recordOccur.name = "haha";
    recordOccur.userId = 1;
    //recordOccur.recordId = 1;
    expect(
      async () => await recordOccurService.createRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordOccurService의 deleteRecordOccur", () => {
  test("recordOccur의 id가 없으면 ArgumentError를 던진다", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur();
    //recordOccur.id = 1;
    recordOccur.date = "asd";
    recordOccur.name = "haha";
    recordOccur.userId = 1;
    recordOccur.recordId = 1;
    expect(
      async () => await recordOccurService.deleteRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 name이 없으면 ArgumentError를 던진다", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur();
    recordOccur.id = 1;
    recordOccur.date = "asd";
    //recordOccur.name = "haha";
    recordOccur.userId = 1;
    recordOccur.recordId = 1;
    expect(
      async () => await recordOccurService.deleteRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 userId가 없으면 ArgumentError를 던진다", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur();
    recordOccur.id = 1;
    recordOccur.date = "asd";
    recordOccur.name = "haha";
    //recordOccur.userId = 1;
    recordOccur.recordId = 1;
    expect(
      async () => await recordOccurService.deleteRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });

  test("recordOccur의 recordId가 없으면 ArgumentError를 던진다", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const recordOccur = new ActOccur();
    recordOccur.id = 1;
    recordOccur.date = "asd";
    recordOccur.name = "haha";
    recordOccur.userId = 1;
    //recordOccur.recordId = 1;
    expect(
      async () => await recordOccurService.deleteRecordOccur(recordOccur)
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordOccurService의 selectRecordOccurByUserId", () => {
  test("user.id가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const user = new User();
    //user.id = 1;
    user.email = "haha";
    expect(
      async () => await recordOccurService.selectRecordOccurByUserId(user)
    ).rejects.toThrowError(ArgumentError);
  });

  test("user.email이 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const user = new User();
    user.id = 1;
    //user.email = "haha";
    expect(
      async () => await recordOccurService.selectRecordOccurByUserId(user)
    ).rejects.toThrowError(ArgumentError);
  });
});

describe("RecordOccurService의 selectRecordOccurByRecordId", () => {
  test("record의 id가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const record = new Activity();
    //record.id = 1;
    record.name = "ja";
    record.userId = 1;
    expect(
      async () => await recordOccurService.selectRecordOccurByRecordId(record)
    ).rejects.toThrowError(ArgumentError);
  });

  test("record의 name이 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const record = new Activity();
    record.id = 1;
    //record.name = "ja";
    record.userId = 1;
    expect(
      async () => await recordOccurService.selectRecordOccurByRecordId(record)
    ).rejects.toThrowError(ArgumentError);
  });

  test("record의 userId가 없으면 ArgumentError를 던진다.", async () => {
    Container.set("RecordOccurRepository", {});
    const recordOccurService = new RecordOccurService(Container);
    const record = new Activity();
    record.id = 1;
    record.name = "ja";
    //record.userId = 1;
    expect(
      async () => await recordOccurService.selectRecordOccurByRecordId(record)
    ).rejects.toThrowError(ArgumentError);
  });
});
