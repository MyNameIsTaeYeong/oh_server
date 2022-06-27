const ShareTag = require("../domains/ShareTag");
const User = require("../domains/User");
const Container = require("typedi").Container;

const getShareTags = async (req, res, next) => {
  Container.get("ShareTagService")
    .selectShareTags({
      user: new User({ id: req.params.id }),
      page: req.query.page,
    })
    .then((results) => {
      req.newAccessToken
        ? res.json({ code: 200, results, accessToken: req.newAccessToken })
        : res.json({ code: 200, results });
      return res.end();
    })
    .catch((e) => next(e));
};

const postShareTags = async (req, res) => {
  Container.get("ShareTagService")
    .createShareTag(
      new ShareTag({ content: req.body.content, userId: req.body.userId })
    )
    .then((insertId) => {
      req.newAccessToken
        ? res.json({ code: 200, insertId, accessToken: req.newAccessToken })
        : res.json({ code: 200, insertId });
      return res.end();
    });
};

module.exports = { postShareTags, getShareTags };
