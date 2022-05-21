const { masterPOOL, slavePOOL } = require("../db");

const getActivities = async (req, res) => {
  try {
    const POOL = slavePOOL;
    const results = await POOL.execute(
      `SELECT * FROM Activities WHERE userId=?`,
      [req.params.id]
    );
    const rtn = {
      code: 200,
      results: results[0],
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
    const { name, userId } = req.body;
    const results = await masterPOOL.execute(
      `INSERT INTO Activities(name, userId) VALUES(?, ?)`,
      [name, userId]
    );
    const rtn = {
      code: 200,
      insertId: results[0].insertId,
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
    await masterPOOL.execute(`DELETE FROM Activities WHERE id=?`, [
      req.params.id,
    ]);
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
