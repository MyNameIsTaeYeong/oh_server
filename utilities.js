const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { cache, POOL } = require("./db");
dotenv.config();

const issueAtoken = (id, which, expiresIn) => {
  const token = jwt.sign({ id, which }, process.env.JWTSECRET, { expiresIn });
  return token;
};

const getCache = async ({ resource, id }) => {
  try {
    let customerRecord = await cache.get(`${resource}:${id}`);

    if (customerRecord) {
      console.log("캐시 hit!");
      return JSON.parse(customerRecord);
    }
    const queryResult = await POOL.execute(
      `SELECT * FROM ${resource} WHERE userId=?`,
      [id]
    );
    customerRecord = queryResult[0];
    await cache.set(`${resource}:${id}`, JSON.stringify(customerRecord), {
      EX: 300,
    });
    console.log("캐시 저장 완료");
    return customerRecord;
  } catch (error) {
    console.log(error);
  }
};

const setCache = async ({ resource, id, duration, values }) => {
  try {
    await cache.set(`${resource}:${id}`, JSON.stringify(values), {
      EX: duration,
    });
    console.log("캐시 저장 완료");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { issueAtoken, getCache, setCache };
