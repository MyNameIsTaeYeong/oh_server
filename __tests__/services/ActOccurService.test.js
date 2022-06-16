const ActOccurService = require("../../services/ActOccurService");
const Container = require("typedi").Container;

afterEach(() => {
  Container.remove("ActivityOccurRepository");
});

describe("actOccurService의 selectRelatedActAndEmo", () => {
  test("selectRelatedActAndEmo는 해당 활동이 발생한 날 같이 발생했던 감정, 활동의 개수를 리턴한다.", async () => {
    Container.set("ActivityOccurRepository", {});
    const actOccurService = new ActOccurService(Container);

    const actOccursOfActivity = [
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
      actOccurService.selectRelatedActAndEmo({
        actOccursOfActivity,
        emoOccursOfUser,
        actOccursOfUser,
      })
    ).toStrictEqual([
      { 기쁨: 1, 슬픔: 1, 화남: 2 },
      { 운동: 3, 독서: 2, 숙면: 1 },
    ]);
  });
});
