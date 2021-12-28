const POOL = require("../db");

const selectByUserId = async (userId) => {
  try {
    const { QUERY } = POOL;
    const rtn = await QUERY`SELECT * FROM users WHERE id = ${userId}`;
    return rtn;
  } catch (error) {
    console.log(error);
  } finally {
    POOL.END();
  }
};

module.exports = { selectByUserId };
