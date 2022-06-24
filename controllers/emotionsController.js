const Emotion = require("../domains/Emotion");
const User = require("../domains/User");

const Container = require("typedi").Container;

const getEmotions = async (req, res, next) => {
  Container.get("EmotionService")
    .selectRecords(new User({ id: req.params.id }))
    .then((results) => {
      req.newAccessToken
        ? res.json({ code: 200, results, accessToken: req.newAccessToken })
        : res.json({ code: 200, results });
      return res.end();
    })
    .catch((e) => next(e));
};

const postEmotions = async (req, res, next) => {
  Container.get("EmotionService")
    .createRecord(new Emotion({ name: req.body.name, userId: req.body.userId }))
    .then((insertId) => {
      req.newAccessToken
        ? res.json({ code: 200, insertId, accessToken: req.newAccessToken })
        : res.json({ code: 200, insertId });
      return res.end();
    })
    .catch((e) => next(e));
};

const deleteEmotions = async (req, res, next) => {
  Container.get("EmotionService")
    .deleteRecord(new Emotion({ id: req.params.id }))
    .then(() => {
      req.newAccessToken
        ? res.json({ code: 200, accessToken: req.newAccessToken })
        : res.json({ code: 200 });
      return res.end();
    })
    .catch((e) => next(e));
};

module.exports = { getEmotions, postEmotions, deleteEmotions };
