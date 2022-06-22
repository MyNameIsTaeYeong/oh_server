const Activity = require("../domains/Activity");
const User = require("../domains/User");

const Container = require("typedi").Container;

const getActivities = async (req, res, next) => {
  Container.get("ActivityService")
    .selectRecords(new User({ id: req.params.id }))
    .then((results) => {
      req.newAccessToken
        ? res.json({ code: 200, results, accessToken: req.newAccessToken })
        : res.json({ code: 200, results });
      return res.end();
    })
    .catch((e) => next(e));
};

const postActivities = async (req, res, next) => {
  Container.get("ActivityService")
    .createRecord(
      new Activity({ name: req.body.name, userId: req.body.userId })
    )
    .then((insertId) => {
      req.newAccessToken
        ? res.json({ code: 200, insertId, accessToken: req.newAccessToken })
        : res.json({ code: 200, insertId });
      return res.end();
    })
    .catch((e) => next(e));
};

const deleteActivities = async (req, res, next) => {
  Container.get("ActivityService")
    .deleteRecord(new Activity({ id: req.params.id }))
    .then(() => {
      req.newAccessToken
        ? res.json({ code: 200, accessToken: req.newAccessToken })
        : res.json({ code: 200 });
      return res.end();
    })
    .catch((e) => next(e));
};

module.exports = { getActivities, postActivities, deleteActivities };
