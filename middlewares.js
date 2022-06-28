const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { issueAtoken } = require("./utilities");
const UnexpectedError = require("./errors/UnexpectedError");
const DuplicatedError = require("./errors/DuplicatedError");
const { RedisError } = require("redis-errors");
dotenv.config();
const Container = require("typedi").Container;

const verifyToken = async (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWTSECRET
    );

    if (decoded.which === "refresh") {
      const refreshToken = await Container.get("cache").get(
        `${"RefreshToken"}:${decoded.id}`
      );

      if (refreshToken !== req.headers.authorization) {
        return res.status(401).json({
          code: 401,
          message: "JsonWebTokenError",
        });
      }

      req.newAccessToken = issueAtoken(decoded.id, "access", "60m");
    }

    return next();
  } catch (error) {
    console.log(error);

    // 403 Forbidden
    if (error.name === "TokenExpiredError") {
      res.status(403).json({
        code: 403,
        message: "TokenExpiredError",
      });

      return res.end();
    }
    // 401 Unauthorized
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        code: 401,
        message: "JsonWebTokenError",
      });
      return res.end();
    }

    res.status(500);
    return res.end();
  }
};

const errorCollector = (error, req, res, next) => {
  if (error instanceof UnexpectedError) {
    res.status(500);
  } else if (error instanceof TypeError) {
    res.status(500);
  } else if (error instanceof DuplicatedError) {
    res.status(409);
  } else if (error instanceof RedisError) {
    res.status(500);
  } else {
    res.status(500);
  }
  console.log(error.name);
  console.log(`Error Message : ${error.message}`);
  console.log(`Error cause : ${error.cause}`);

  return res.end();
};

module.exports = { verifyToken, errorCollector };
