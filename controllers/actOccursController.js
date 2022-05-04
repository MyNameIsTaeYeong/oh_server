const { POOL } = require("../db");
const { getCache } = require("../utilities");

const getActOccurs = async (req, res) => {
  try {
    const records = await getCache({
      resource: "ActOccurrences",
      id: req.params.id,
    });

    const rtn = {
      code: 200,
      results: records,
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

const postActOccurs = async (req, res) => {
  try {
    const { activityName, userId, recordId } = req.body;
    const results = await POOL.execute(
      `INSERT INTO ActOccurrences(activityName, userId, recordId) VALUES(?, ?, ?)`,
      [activityName, userId, recordId]
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

const postActAndEmo = async (req, res) => {
  try {
    const temp = await Promise.all([
      POOL.execute(
        `SELECT emotionName as name, count(emotionName) as cnt FROM EmoOccurrences as E
            WHERE DATE_FORMAT(date, '%y-%m-%d')
            IN (SELECT DATE_FORMAT(date, '%y-%m-%d') 
                FROM ActOccurrences
                WHERE activityName=? AND userId=?
                GROUP BY DATE_FORMAT(date,'%y-%m-%d'))
            AND userId=?
            GROUP BY emotionName;`,
        [req.body.activityName, req.params.userId, req.params.userId]
      ),
      POOL.execute(
        `SELECT activityName as name, count(activityName) as cnt FROM ActOccurrences as A
            WHERE DATE_FORMAT(date,'%y-%m-%d') 
            IN (SELECT DATE_FORMAT(date, '%y-%m-%d')
                FROM ActOccurrences 
                WHERE activityName=? AND userId=?
                GROUP BY DATE_FORMAT(date,'%y-%m-%d'))
            AND userId=?
            GROUP BY activityName;`,
        [req.body.activityName, req.params.userId, req.params.userId]
      ),
    ]);

    const results = [];
    results.push(temp[0][0]);
    results.push(temp[1][0]);

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

module.exports = { getActOccurs, postActOccurs, postActAndEmo };
