const dotenv = require("dotenv");
const { issueAtoken } = require("../utilities");
const User = require("../domains/User");
const Container = require("typedi").Container;
dotenv.config();

const getUsers = async (req, res, next) => {
  Container.get("UserService")
    .findUserUsingEmail(new User({ email: req.params.email }))
    .then(async (user) => {
      if (!user) {
        throw new Error("해당 유저 없음.");
      }
      const accessToken = issueAtoken(user.id, "access", "60m");
      const refreshToken = issueAtoken(user.id, "refresh", "1800m");
      await Container.get("cache").set(
        `RefreshToken:${user.id}`,
        refreshToken,
        {
          EX: 108000,
        }
      );

      res.json({
        code: 200,
        id: user.id,
        accessToken,
        refreshToken,
      });

      return res.end();
    })
    .catch((e) => next(e));
};

const postUsers = async (req, res, next) => {
  Container.get("UserService")
    .join(new User({ email: req.body.email }))
    .then(async (userId) => {
      const accessToken = issueAtoken(userId, "access", "60m");
      const refreshToken = issueAtoken(userId, "refresh", "1800m");
      await Container.get("cache").set(`RefreshToken:${userId}`, refreshToken, {
        EX: 108000,
      });
      res.json({
        code: 200,
        id: userId,
        accessToken,
        refreshToken,
      });
      return res.end();
    })
    .catch((e) => next(e));
};

module.exports = { getUsers, postUsers };
