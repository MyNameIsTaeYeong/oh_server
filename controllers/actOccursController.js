const POOL = require("../db");

const getActOccurs = async (req, res) => {
  try {
    const { QUERY, EQ } = POOL;
    const results = await QUERY`SELECT * FROM ActOccurrences WHERE ${EQ({
      userId: req.params.id,
    })}`;
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

const postActOccurs = async (req, res) => {
  try {
    const { QUERY, VALUES } = POOL;
    const results = await QUERY`INSERT INTO ActOccurrences ${VALUES(req.body)}`;
    res.status(200).json(results.insertId);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

module.exports = { getActOccurs, postActOccurs };
