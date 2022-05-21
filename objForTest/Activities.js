const { masterPOOL: POOL } = require("../db");

const Activities = {
  createTestActivity: async ({ name, userId }) => {
    try {
      const results = await POOL.execute(
        `INSERT INTO Activities(name, userId) VALUES(?, ?)`,
        [name, userId]
      );
      return results[0].insertId;
    } catch (error) {
      console.log(error);
    }
  },

  deleteTestActivity: async ({ userId }) => {
    try {
      await POOL.execute(`DELETE FROM Activities WHERE userId=?`, [userId]);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = Activities;
