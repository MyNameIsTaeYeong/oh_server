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

  rtn.insertId === "error" ? res.status(500) : res.status(200).json(rtn);
  res.end();
};

const deleteActivities = async (req, res) => {
  if (
    (await writeToDB(`DELETE FROM Activities WHERE id=?`, [req.params.id])) ===
    "error"
  ) {
    res.status(500);
  } else {
    const rtn = {
      code: 200,
    };

    if (req.newAccessToken) {
      rtn.accessToken = req.newAccessToken;
    }

    res.json(rtn);
  }

  res.end();
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
  try {
    const result = (await masterPOOL.execute(query, params))[0];
    return result;
  } catch (error) {
    console.log(error);
    return "error";
  }
};

module.exports = { getActivities, postActivities, deleteActivities };
