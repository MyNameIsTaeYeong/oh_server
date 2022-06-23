const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { issueAtoken, getCache } = require("./utilities");
const UnexpectedError = require("./errors/UnexpectedError");
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
      res.json({
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
    console.log(`여기는 errorCollector UnexpectedError : ${error.cause}`);
  } else if (error instanceof TypeError) {
    console.log(`여기는 errorCollector TypeError : ${error.cause}`);
  } else {
    console.log(`여기는 errorCollector error : ${error}`);
  }

  res.status(500).res.json({ error });
  return res.end();
};

module.exports = { verifyToken, errorCollector };
