const POOL = require("../db");
const dotenv = require("dotenv");
const { issueAtoken } = require("../utilities");

dotenv.config();

const getUsers = async (req, res) => {
  try {
    const { QUERY, EQ, VALUES } = POOL;
    const results = await QUERY`SELECT * FROM Users WHERE ${EQ({
      email: req.params.email,
    })}`;
    const userId = results[0].id;
    const accessToken = issueAtoken(userId, "access", "60m");
    const refreshToken = issueAtoken(userId, "refresh", "1800m");

    await QUERY`UPDATE RefreshTokens SET ${VALUES({ refreshToken })} WHERE ${EQ(
      {
        userId,
      }
    )}`;

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
  const { TRANSACTION } = POOL;
  const { QUERY, COMMIT, VALUES, ROLLBACK } = await TRANSACTION();
  try {
    const results = await QUERY`INSERT INTO Users ${VALUES(req.body)}`;

    const userId = results.insertId;
    const accessToken = issueAtoken(userId, "access", "60m");
    const refreshToken = issueAtoken(userId, "refresh", "1800m");

    await Promise.all([
      QUERY`INSERT INTO RefreshTokens ${VALUES({
        userId,
        refreshToken,
      })}`,
      QUERY`INSERT INTO Emotions ${VALUES({
        name: "기쁨",
        userId,
      })}`,
      QUERY`INSERT INTO Emotions ${VALUES({
        name: "화남",
        userId,
      })}`,
      QUERY`INSERT INTO Emotions ${VALUES({
        name: "슬픔",
        userId,
      })}`,
      QUERY`INSERT INTO Activities ${VALUES({
        name: "운동",
        userId,
      })}`,
      QUERY`INSERT INTO Activities ${VALUES({
        name: "독서",
        userId,
      })}`,
      QUERY`INSERT INTO Activities ${VALUES({
        name: "설거지",
        userId,
      })}`,
    ]);

    await COMMIT();
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
    await ROLLBACK();
  } finally {
    return res.end();
  }
};

module.exports = { getUsers, postUsers };
