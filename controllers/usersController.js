const POOL = require("../db");
const { SERVER } = require("../global");

const getUsers = async (req, res) => {
  try {
    const { QUERY, EQ } = POOL;
    const results = await QUERY`SELECT * FROM users WHERE ${EQ({
      email: req.params.email,
    })}`;
    res.status(200).json(results[0].id);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    //POOL.END();
    return res.end();
  }
};

const postUsers = async (req, res) => {
  const { TRANSACTION } = POOL;
  const { QUERY, COMMIT, VALUES, ROLLBACK } = await TRANSACTION();
  try {
    const results = await QUERY`INSERT INTO Users ${VALUES(req.body)}`;

    await Promise.all([
      QUERY`INSERT INTO Emotions ${VALUES({
        name: "기쁨",
        userId: results.insertId,
      })}`,
      QUERY`INSERT INTO Emotions ${VALUES({
        name: "화남",
        userId: results.insertId,
      })}`,
      QUERY`INSERT INTO Emotions ${VALUES({
        name: "슬픔",
        userId: results.insertId,
      })}`,
      QUERY`INSERT INTO Activities ${VALUES({
        name: "운동",
        userId: results.insertId,
      })}`,
      QUERY`INSERT INTO Activities ${VALUES({
        name: "독서",
        userId: results.insertId,
      })}`,
      QUERY`INSERT INTO Activities ${VALUES({
        name: "설거지",
        userId: results.insertId,
      })}`,
    ]);

    await COMMIT();
    res.status(200).json(results.insertId);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.writeHead(302, {
        Location: `${SERVER}/users/${req.body.email}`,
      });
    } else {
      console.log(error);
      res.status(500);
    }
    await ROLLBACK();
  } finally {
    //POOL.END();
    return res.end();
  }
};

module.exports = { getUsers, postUsers };
