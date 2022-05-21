const { masterPOOL, slavePOOL } = require("../db");

const getActivities = async (req, res) => {
  const rtn = {
    code: 200,
    results: await readFromDB(`SELECT * FROM Activities WHERE userId=?`, [
      req.params.id,
    ]),
  };

  if (req.newAccessToken) {
    rtn.accessToken = req.newAccessToken;
  }

  rtn.results === "error" ? res.status(500) : res.json(rtn);
  res.end();
};

const postActivities = async (req, res) => {
  try {
    const rtn = {
      code: 200,
      insertId: (
        await writeToDB(`INSERT INTO Activities(name, userId) VALUES(?, ?)`, [
          req.body.name,
          req.body.userId,
        ])
      ).insertId,
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
    await writeToDB(`DELETE FROM Activities WHERE id=?`, [req.params.id]);

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

const readFromDB = async (query, params) => {
  try {
    const result = (await slavePOOL.execute(query, params))[0];
    return result;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const writeToDB = async (query, params) => {
  const result = (await masterPOOL.execute(query, params))[0];

  return result;
};

module.exports = { getActivities, postActivities, deleteActivities };
