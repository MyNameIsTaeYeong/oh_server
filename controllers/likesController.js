const ShareTag = require("../domains/ShareTag");
const Container = require("typedi").Container;

const postLikes = async (req, res, next) => {
  Container.get("ShareTagService")
    .updateLikeCnt({
      shareTag: new ShareTag({ id: req.body.tagId }),
      cnt: Number(req.body.cnt),
    })
    .then(() => res.end())
    .catch((e) => next(e));
};

module.exports = { postLikes };
