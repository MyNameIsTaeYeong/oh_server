const User = require("../domains/User");

const Container = require("typedi").Container;

const getActivities = async (req, res, next) => {
  Container.get("ActivityService")
    .selectRecords(new User({ id: req.params.id }))
    .then((results) => {
      req.newAccessToken
        ? res.json({ code: 200, results, accessToken: req.newAccessToken })
        : res.json({ code: 200, results });
      return res.end();
    })
    .catch((e) => next(e));
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

module.exports = { getActivities, postActivities, deleteActivities };

// const getActivities = async (req, res) => {
//   const rtn = {
//     code: 200,
//     results: await readFromDB(`SELECT * FROM Activities WHERE userId=?`, [
//       req.params.id,
//     ]),
//   };

//   if (req.newAccessToken) {
//     rtn.accessToken = req.newAccessToken;
//   }

//   rtn.results === "error" ? res.status(500) : res.json(rtn);
//   res.end();
// };
