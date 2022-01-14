const POOL = require("../db");

const getEmoOccurs = async (req, res) => {
  try {
    const { QUERY, EQ } = POOL;
    const results = await QUERY`SELECT * FROM EmoOccurrences WHERE ${EQ({
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

const postEmoOccurs = async (req, res) => {
  try {
    const { QUERY, VALUES } = POOL;
    const results = await QUERY`INSERT INTO EmoOccurrences ${VALUES(req.body)}`;
    res.status(200).json(results.insertId);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

const postEmoAndAct = async (req, res) => {
  try {
    const { QUERY } = POOL;
    const results = await Promise.all([
      QUERY`SELECT emotionName as name, count(emotionName) as cnt FROM EmoOccurrences as E
            WHERE DATE_FORMAT(date,'%y-%m-%d') 
            IN (SELECT DATE_FORMAT(date,'%y-%m-%d') as date
                FROM EmoOccurrences 
                WHERE emotionName=${req.body.emotionName} AND userId=${req.params.userId}
                GROUP BY DATE_FORMAT(date,'%y-%m-%d'))  AND userId=${req.params.userId}
            GROUP BY emotionName;`,
      QUERY`SELECT activityName as name, count(activityName) as cnt FROM ActOccurrences as A
            WHERE DATE_FORMAT(date,'%y-%m-%d') 
            IN (SELECT DATE_FORMAT(date,'%y-%m-%d') as date
                FROM EmoOccurrences 
                WHERE emotionName=${req.body.emotionName} AND userId=${req.params.userId}
                GROUP BY DATE_FORMAT(date,'%y-%m-%d'))
            AND userId=${req.params.userId}
            GROUP BY activityName;`,
    ]);
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

module.exports = { getEmoOccurs, postEmoOccurs, postEmoAndAct };
