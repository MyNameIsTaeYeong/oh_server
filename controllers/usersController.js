const { POOL, slavePOOL, getConnection } = require("../db");
const dotenv = require("dotenv");
const { issueAtoken, setCache } = require("../utilities");

dotenv.config();

const getUsers = async (req, res) => {
  try {
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

    // await setCache({
    //   resource: "RefreshTokens",
    //   id: userId,
    //   duration: 108000,
    //   values: [{ userId, refreshToken }],
    // });

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
  const conn = await getConnection();
  if (conn === -1) {
    res.status(500);
    return res.end();
  }

  try {
    conn.beginTransaction();

    const { email } = req.body;
    const results = await conn.execute(`INSERT INTO Users(email) VALUES(?)`, [
      email,
    ]);

    const userId = results[0].insertId;
    const accessToken = issueAtoken(userId, "access", "60m");
    const refreshToken = issueAtoken(userId, "refresh", "1800m");

    conn.execute(
      `INSERT INTO RefreshTokens(userId, refreshToken) VALUES(?, ?)`,
      [userId, refreshToken]
    );
    conn.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
      "기쁨",
      userId,
    ]);
    conn.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
      "화남",
      userId,
    ]);
    conn.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
      "슬픔",
      userId,
    ]);
    conn.execute(`INSERT INTO Activities(name, userId) VALUES(?, ?)`, [
      "운동",
      userId,
    ]);
    conn.execute(`INSERT INTO Activities(name, userId) VALUES(?, ?)`, [
      "독서",
      userId,
    ]);
    conn.execute(`INSERT INTO Activities(name, userId) VALUES(?, ?)`, [
      "설거지",
      userId,
    ]);

    await conn.commit();

    await setCache({
      resource: "RefreshTokens",
      id: userId,
      duration: 108000,
      values: [{ userId, refreshToken }],
    });

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
    await conn.rollback();
  } finally {
    conn.release();
    return res.end();
  }
};

module.exports = { getUsers, postUsers };
