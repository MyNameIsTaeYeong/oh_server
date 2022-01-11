const POOL = require("../db");

const getEmotions = async (req, res) => {
  try {
    const { QUERY, EQ } = POOL;
    const results = await QUERY`SELECT * FROM Emotions WHERE ${EQ({
      userId: req.params.id,
    })}`;
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    POOL.END();
    return res.end();
  }
};

const postEmotions = async (req, res) => {
  try {
    const { QUERY, VALUES } = POOL;
    const results = await QUERY`INSERT INTO Emotions ${VALUES(req.body)}`;
    res.status(200).json(results.insertId);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    POOL.END();
    return res.end();
  }
};

module.exports = { getEmotions, postEmotions };
