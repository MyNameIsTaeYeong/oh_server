const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const issueAtoken = (id, which, expiresIn) => {
  const token = jwt.sign({ id, which }, process.env.JWTSECRET, { expiresIn });
  return token;
};

module.exports = { issueAtoken };
