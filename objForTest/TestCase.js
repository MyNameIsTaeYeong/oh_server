const Activities = require("./Activities");
const ActOccurrences = require("./ActOccurrences");
const Emotions = require("./Emotions");
const EmoOccurrences = require("./EmoOccurrences");

const TestCase = {
  case1: async ({ userId, recordId }) => {
    const recordIds = [];

    recordIds.push(await Emotions.createTestEmotion({ name: "기쁨", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "슬픔", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "짜증", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "설렘", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "화남", userId }));

    recordIds.push(
      await Activities.createTestActivity({ name: "독서", userId })
    );
    recordIds.push(
      await Activities.createTestActivity({ name: "숙면", userId })
    );

    await Promise.all([
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        date: "2022-04-12 12:42:34",
        userId,
        recordId,
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        date: "2022-04-08 10:42:34",
        userId,
        recordId,
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        date: "2022-04-04 08:42:34",
        userId,
        recordId,
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        userId,
        recordId: recordIds[0],
        date: "2022-04-04 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        userId,
        recordId: recordIds[0],
        date: "2022-04-05 10:00:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        userId,
        recordId: recordIds[0],
        date: "2022-04-06 10:10:20",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        userId,
        recordId: recordIds[0],
        date: "2022-04-09 13:02:04",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "슬픔",
        userId,
        recordId: recordIds[1],
        date: "2022-04-08 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "짜증",
        userId,
        recordId: recordIds[2],
        date: "2022-03-28 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "설렘",
        userId,
        recordId: recordIds[3],
        date: "2022-04-30 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "화남",
        userId,
        recordId: recordIds[4],
        date: "2022-04-12 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "화남",
        userId,
        recordId: recordIds[4],
        date: "2022-04-08 10:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "독서",
        userId,
        recordId: recordIds[5],
        date: "2022-04-12 08:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "독서",
        userId,
        recordId: recordIds[5],
        date: "2022-04-15 08:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "독서",
        userId,
        recordId: recordIds[5],
        date: "2022-04-08 08:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "숙면",
        userId,
        recordId: recordIds[6],
        date: "2022-04-08 18:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "숙면",
        userId,
        recordId: recordIds[6],
        date: "2022-04-09 18:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "숙면",
        userId,
        recordId: recordIds[6],
        date: "2022-04-10 18:42:34",
      }),
    ]);
  },
  case1: async ({ userId, recordId }) => {
    const recordIds = [];

    recordIds.push(await Emotions.createTestEmotion({ name: "기쁨", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "슬픔", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "짜증", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "설렘", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "화남", userId }));

    recordIds.push(
      await Activities.createTestActivity({ name: "독서", userId })
    );
    recordIds.push(
      await Activities.createTestActivity({ name: "숙면", userId })
    );

    await Promise.all([
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        date: "2022-04-12 12:42:34",
        userId,
        recordId,
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        date: "2022-04-08 10:42:34",
        userId,
        recordId,
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        date: "2022-04-04 08:42:34",
        userId,
        recordId,
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        userId,
        recordId: recordIds[0],
        date: "2022-04-04 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        userId,
        recordId: recordIds[0],
        date: "2022-04-05 10:00:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        userId,
        recordId: recordIds[0],
        date: "2022-04-06 10:10:20",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        userId,
        recordId: recordIds[0],
        date: "2022-04-09 13:02:04",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "슬픔",
        userId,
        recordId: recordIds[1],
        date: "2022-04-08 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "짜증",
        userId,
        recordId: recordIds[2],
        date: "2022-03-28 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "설렘",
        userId,
        recordId: recordIds[3],
        date: "2022-04-30 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "화남",
        userId,
        recordId: recordIds[4],
        date: "2022-04-12 15:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "화남",
        userId,
        recordId: recordIds[4],
        date: "2022-04-08 10:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "독서",
        userId,
        recordId: recordIds[5],
        date: "2022-04-12 08:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "독서",
        userId,
        recordId: recordIds[5],
        date: "2022-04-15 08:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "독서",
        userId,
        recordId: recordIds[5],
        date: "2022-04-08 08:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "숙면",
        userId,
        recordId: recordIds[6],
        date: "2022-04-08 18:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "숙면",
        userId,
        recordId: recordIds[6],
        date: "2022-04-09 18:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "숙면",
        userId,
        recordId: recordIds[6],
        date: "2022-04-10 18:42:34",
      }),
    ]);
  },

  case2: async ({ userId, recordId }) => {
    const recordIds = [];

    recordIds.push(
      await Activities.createTestActivity({ name: "운동", userId })
    );
    recordIds.push(
      await Activities.createTestActivity({ name: "숙면", userId })
    );
    recordIds.push(
      await Activities.createTestActivity({ name: "빡공", userId })
    );
    recordIds.push(
      await Activities.createTestActivity({ name: "독서", userId })
    );
    recordIds.push(
      await Activities.createTestActivity({ name: "청소", userId })
    );

    recordIds.push(await Emotions.createTestEmotion({ name: "화남", userId }));
    recordIds.push(await Emotions.createTestEmotion({ name: "짜증", userId }));

    await Promise.all([
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        date: "2022-04-12 12:42:34",
        userId,
        recordId,
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        date: "2022-04-08 10:42:34",
        userId,
        recordId,
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "기쁨",
        date: "2022-04-04 08:42:34",
        userId,
        recordId,
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        userId,
        recordId: recordIds[0],
        date: "2022-04-04 15:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        userId,
        recordId: recordIds[0],
        date: "2022-04-05 10:00:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        userId,
        recordId: recordIds[0],
        date: "2022-04-06 10:10:20",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "운동",
        userId,
        recordId: recordIds[0],
        date: "2022-04-09 13:02:04",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "숙면",
        userId,
        recordId: recordIds[1],
        date: "2022-04-08 15:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "빡공",
        userId,
        recordId: recordIds[2],
        date: "2022-03-28 15:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "독서",
        userId,
        recordId: recordIds[3],
        date: "2022-04-30 15:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "청소",
        userId,
        recordId: recordIds[4],
        date: "2022-04-12 15:42:34",
      }),
      ActOccurrences.createTestActOccurs({
        activityName: "청소",
        userId,
        recordId: recordIds[4],
        date: "2022-04-08 10:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "화남",
        userId,
        recordId: recordIds[5],
        date: "2022-04-12 08:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "화남",
        userId,
        recordId: recordIds[5],
        date: "2022-04-15 08:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "화남",
        userId,
        recordId: recordIds[5],
        date: "2022-04-08 08:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "짜증",
        userId,
        recordId: recordIds[6],
        date: "2022-04-08 18:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "짜증",
        userId,
        recordId: recordIds[6],
        date: "2022-04-09 18:42:34",
      }),
      EmoOccurrences.createTestEmoOccurs({
        emotionName: "짜증",
        userId,
        recordId: recordIds[6],
        date: "2022-04-10 18:42:34",
      }),
    ]);
  },
};

module.exports = TestCase;
