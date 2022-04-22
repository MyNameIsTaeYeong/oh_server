const { POOL } = require("../db");

const Emotions = {
  createTestEmotion: async ({ name, userId }) => {
    try {
      const results = await POOL.execute(
        "INSERT INTO Emotions(name, userId) VALUES(?, ?)",
        [name, userId]
      );
      return results[0].insertId;
    } catch (error) {
      console.log(error);
    }
  },

  deleteTestEmotion: async ({ userId }) => {
    try {
      await POOL.execute("DELETE FROM Emotions WHERE userId=?", [userId]);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = Emotions;
