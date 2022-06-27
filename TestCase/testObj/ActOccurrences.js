const { POOL } = require("../../db");

const ActOccurrences = {
  createTestActOccurs: async ({ activityName, userId, recordId, date }) => {
    try {
      const results = await POOL.execute(
        `INSERT INTO ActOccurrences(activityName, userId, recordId, date) VALUES(?, ?, ?, ?)`,
        [activityName, userId, recordId, date]
      );
      return results[0].insertId;
    } catch (error) {
      console.log(error);
    }
  },

  deleteTestActOccurs: async ({ userId }) => {
    try {
      await POOL.execute(`DELETE FROM ActOccurrences WHERE userId=?`, [userId]);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = ActOccurrences;
