const { POOL } = require("../db");

const RefreshToken = {
  createTestRefreshToken: async (userId, refreshToken) => {
    try {
      await POOL.execute(
        `INSERT INTO RefreshTokens(userId, refreshToken) VALUES(?, ?)`,
        [userId, refreshToken]
      );
    } catch (error) {
      console.log(error);
    }
  },

  deleteTestRefreshToken: async (uesrId) => {
    try {
      await POOL.execute(`DELETE FROM RefreshTokens WHERE userId=?`, [uesrId]);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = RefreshToken;
