const Activity = require("../domains/Activity");
const ActOccur = require("../domains/ActOccur");
const User = require("../domains/User");
const Container = require("typedi").Container;

const getActOccurs = async (req, res, next) => {
  Container.get("ActivityOccurService")
    .selectRecordOccurByUserId(new User({ id: req.params.id }))
    .then((results) => {
      req.newAccessToken
        ? res.json({ code: 200, results, accessToken: req.newAccessToken })
        : res.json({ code: 200, results });
      return res.end();
    })
    .catch((e) => next(e));
};

const postActOccurs = async (req, res, next) => {
  Container.get("ActivityOccurService")
    .createRecordOccur({
      recordOccur: new ActOccur({
        name: req.body.activityName,
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

const postActAndEmo = async (req, res, next) => {
  Container.get("ActivityOccurService")
    .selectRelatedRecords({
      targetRecord: new Activity({
        id: req.body.recordId,
        name: req.body.activityName,
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

module.exports = { getActOccurs, postActOccurs, postActAndEmo };
