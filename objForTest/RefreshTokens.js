const { masterPOOL: POOL } = require("../db");

const RefreshTokens = {
  createTestRefreshToken: async ({ userId, refreshToken }) => {
    try {
      await POOL.execute(
        `INSERT INTO RefreshTokens(userId, refreshToken) VALUES(?, ?)`,
        [userId, refreshToken]
      );
    } catch (error) {
      console.log(error);
    }
  },

  deleteTestRefreshToken: async ({ userId }) => {
    try {
      await POOL.execute(`DELETE FROM RefreshTokens WHERE userId=?`, [userId]);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = RefreshTokens;
