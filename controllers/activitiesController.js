const POOL = require("../db");

const getActivities = async (req, res) => {
  try {
    const { QUERY, EQ } = POOL;
    const results = await QUERY`SELECT * FROM Activities WHERE ${EQ({
      userId: req.params.id,
    })}`;

    const rtn = {
      code: 200,
      results,
    };

    if (req.newAccessToken) {
      rtn.accessToken = req.newAccessToken;
    }

    res.json(rtn);
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

    const rtn = {
      code: 200,
      insertId: results.insertId,
    };

    if (req.newAccessToken) {
      rtn.accessToken = req.newAccessToken;
    }

    res.status(200).json(rtn);
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

    const rtn = {
      code: 200,
    };

    if (req.newAccessToken) {
      rtn.accessToken = req.newAccessToken;
    }

    res.json(rtn);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

module.exports = { getActivities, postActivities, deleteActivities };
