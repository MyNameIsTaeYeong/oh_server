const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { cache, POOL } = require("./db");
dotenv.config();

const issueAtoken = (id, which, expiresIn) => {
  const token = jwt.sign({ id, which }, process.env.JWTSECRET, { expiresIn });
  return token;
};

const getCache = async ({ resource, id }) => {
  customerRecord = await cache.get(`${resource}:${id}`);

  if (customerRecord) {
    console.log("캐시 hit!");
    return customerRecord;
  }

  customerRecord = await POOL.execute(
    `SELECT * FROM ${resource} WHERE userId=?`,
    [id]
  );
  await cache.set(`${resource}:${id}`, customerRecord, "EX", 10, () => {
    console.log("캐시 저장 완료");
  });
};

module.exports = { issueAtoken, getCache };
