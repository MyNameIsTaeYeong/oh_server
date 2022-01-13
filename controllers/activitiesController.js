const POOL = require("../db");

const getActivities = async (req, res) => {
  try {
    const { QUERY, EQ } = POOL;
    const results = await QUERY`SELECT * FROM Activities WHERE ${EQ({
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

const postActivities = async (req, res) => {
  try {
    const { QUERY, VALUES } = POOL;
    const results = await QUERY`INSERT INTO Activities ${VALUES(req.body)}`;
    res.status(200).json(results.insertId);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

const deleteActivities = async (req, res) => {
  try {
    const { QUERY } = POOL;
    await QUERY`DELETE FROM Activities WHERE id = ${req.params.id}`;
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

module.exports = { getActivities, postActivities, deleteActivities };
