const Like = require("../domains/Like");
const Container = require("typedi").Container;

const postLikes = async (req, res, next) => {
  Container.get("LikeService")
    .createLike(new Like({ userId: req.body.userId, tagId: req.body.tagId }))
    .then(() => res.end())
    .catch((e) => next(e));
};

const deleteLikes = async (req, res, next) => {
  Container.get("LikeService")
    .deleteLike(new Like({ userId: req.body.userId, tagId: req.body.tagId }))
    .then(() => res.end())
    .catch((e) => next(e));
};

module.exports = { postLikes, deleteLikes };
