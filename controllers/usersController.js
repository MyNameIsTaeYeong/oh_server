const POOL = require("../db");
const dotenv = require("dotenv");
const { issueAtoken } = require("../utilities");

dotenv.config();

const getUsers = async (req, res) => {
  try {
    // const { QUERY, EQ } = POOL;
    // const results = await QUERY`SELECT * FROM Users WHERE ${EQ({
    //   email: req.params.email,
    // })}`;
    const results = await POOL.execute(`SELECT * FROM Users WHERE email=?`, [
      req.params.email,
    ]);
    const userId = results[0][0].id;
    const accessToken = issueAtoken(userId, "access", "60m");
    const refreshToken = issueAtoken(userId, "refresh", "1800m");

    await POOL.execute(
      `UPDATE RefreshTokens SET refreshToken=? WHERE userId=?`,
      [refreshToken, userId]
    );

    // await QUERY`UPDATE RefreshTokens SET ${EQ({ refreshToken })} WHERE ${EQ({
    //   userId,
    // })}`;

    res.json({
      code: 200,
      id: userId,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

const postUsers = async (req, res) => {
  // const { TRANSACTION } = POOL;
  // const { QUERY, COMMIT, VALUES, ROLLBACK } = await TRANSACTION();

  try {
    await POOL.query("START TRANSACTION");

    const { email } = req.body;
    const results = await POOL.execute(`INSERT INTO Users(email) VALUES(?)`, [
      email,
    ]);

    const userId = results[0].insertId;
    const accessToken = issueAtoken(userId, "access", "60m");
    const refreshToken = issueAtoken(userId, "refresh", "1800m");

    await Promise.all([
      POOL.execute(
        `INSERT INTO RefreshTokens(userId, refreshToken) VALUES(?, ?)`,
        [userId, refreshToken]
      ),
      POOL.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
        "기쁨",
        userId,
      ]),
      POOL.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
        "화남",
        userId,
      ]),
      POOL.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
        "슬픔",
        userId,
      ]),
      POOL.execute(`INSERT INTO Activities(name, userId) VALUES(?, ?)`, [
        "운동",
        userId,
      ]),
      POOL.execute(`INSERT INTO Activities(name, userId) VALUES(?, ?)`, [
        "독서",
        userId,
      ]),
      POOL.execute(`INSERT INTO Activities(name, userId) VALUES(?, ?)`, [
        "설거지",
        userId,
      ]),
    ]);
    POOL.query("COMMIT");
    // await COMMIT();
    res.json({
      code: 200,
      id: userId,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.writeHead(302, {
        Location: `${process.env.SERVER}/users/${req.body.email}`,
      });
    } else {
      console.log(error);
      res.status(500);
    }
    //await ROLLBACK();
    POOL.query("ROLLBACK");
  } finally {
    return res.end();
  }
};

module.exports = { getUsers, postUsers };
