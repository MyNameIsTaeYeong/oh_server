const EmoOccur = require("../domains/EmoOccur");
const Emotion = require("../domains/Emotion");
const User = require("../domains/User");
const Container = require("typedi").Container;

const getEmoOccurs = async (req, res, next) => {
  Container.get("EmotionOccurService")
    .selectRecordOccurByUserId(new User({ id: req.params.id }))
    .then((results) => {
      req.newAccessToken
        ? res.json({ code: 200, results, accessToken: req.newAccessToken })
        : res.json({ code: 200, results });
      return res.end();
    })
    .catch((e) => next(e));
};

const postEmoOccurs = async (req, res, next) => {
  Container.get("EmotionOccurService")
    .createRecordOccur({
      recordOccur: new EmoOccur({
        name: req.body.emotionName,
        userId: req.body.userId,
        date: new Date(),
        recordId: req.body.recordId,
      }),
    })
    .then((insertId) => {
      req.newAccessToken
        ? res.json({ code: 200, insertId, accessToken: req.newAccessToken })
        : res.json({ code: 200, insertId });
      return res.end();
    })
    .catch((e) => next(e));
};

const postEmoAndAct = async (req, res, next) => {
  Container.get("EmotionOccurService")
    .selectRelatedRecords({
      targetRecord: new Emotion({
        id: req.body.recordId,
        name: req.body.emotionName,
        userId: req.params.userId,
      }),
      user: new User({ id: req.params.userId }),
    })
    .then((results) => {
      req.newAccessToken
        ? res.json({ code: 200, results, accessToken: req.newAccessToken })
        : res.json({ code: 200, results });
      return res.end();
    })
    .catch((e) => next(e));
};

module.exports = { getEmoOccurs, postEmoOccurs, postEmoAndAct };
