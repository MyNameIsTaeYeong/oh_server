const jwt = require("jsonwebtoken");
const POOL = require("./db");
const dotenv = require("dotenv");
const { issueAtoken } = require("./utilities");
dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWTSECRET
    );

    if (decoded.which === "refresh") {
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
      res.json({
        code: 401,
        message: "JsonWebTokenError",
      });
      return res.end();
    }

    res.status(500);
    return res.end();
  }
};

module.exports = { verifyToken };
