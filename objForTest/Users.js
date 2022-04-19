const { POOL } = require("../db");

const Users = {
  createTestUser: async () => {
    try {
      const res = await POOL.execute(`INSERT INTO Users(email) VALUES(?)`, [
        "testUser",
      ]);
      return res[0].insertId;
    } catch (error) {
      console.log(error);
    }
  },

  deleteTestUser: async () => {
    try {
      await POOL.execute(`DELETE FROM Users WHERE email=?`, ["testUser"]);
    } catch (error) {
      console.log(error);
    } finally {
      POOL.end();
    }
  },
};

module.exports = Users;
