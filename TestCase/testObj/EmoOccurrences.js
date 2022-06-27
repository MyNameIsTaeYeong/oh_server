const { POOL } = require("../../db");

const EmoOccurrences = {
  createTestEmoOccurs: async ({ emotionName, userId, recordId, date }) => {
    try {
      const results = await POOL.execute(
        `INSERT INTO EmoOccurrences(emotionName, userId, recordId, date) VALUES(?, ?, ?, ?)`,
        [emotionName, userId, recordId, date]
      );
      return results[0].insertId;
    } catch (error) {
      console.log(error);
    }
  },

  deleteTestEmoOccurs: async ({ userId }) => {
    try {
      await POOL.execute(`DELETE FROM EmoOccurrences WHERE userId=?`, [userId]);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = EmoOccurrences;
