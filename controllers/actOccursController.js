const POOL = require("../db");

const getActOccurs = async (req, res) => {
  try {
    const { QUERY, EQ } = POOL;
    const results = await QUERY`SELECT * FROM ActOccurrences WHERE ${EQ({
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

const postActOccurs = async (req, res) => {
  try {
    const { QUERY, VALUES } = POOL;
    const results = await QUERY`INSERT INTO ActOccurrences ${VALUES(req.body)}`;

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

const postActAndEmo = async (req, res) => {
  try {
    const { QUERY } = POOL;
    const results = await Promise.all([
      QUERY`SELECT emotionName as name, count(emotionName) as cnt FROM EmoOccurrences as E
            WHERE DATE_FORMAT(date, '%y-%m-%d')
            IN (SELECT DATE_FORMAT(date, '%y-%m-%d') 
                FROM ActOccurrences
                WHERE activityName=${req.body.activityName} AND userId=${req.params.userId}
                GROUP BY DATE_FORMAT(date,'%y-%m-%d'))
            AND userId=${req.params.userId}
            GROUP BY emotionName;`,
      QUERY`SELECT activityName as name, count(activityName) as cnt FROM ActOccurrences as A
            WHERE DATE_FORMAT(date,'%y-%m-%d') 
            IN (SELECT DATE_FORMAT(date, '%y-%m-%d')
                FROM ActOccurrences 
                WHERE activityName=${req.body.activityName} AND userId=${req.params.userId}
                GROUP BY DATE_FORMAT(date,'%y-%m-%d'))
            AND userId=${req.params.userId}
            GROUP BY activityName;`,
    ]);

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
