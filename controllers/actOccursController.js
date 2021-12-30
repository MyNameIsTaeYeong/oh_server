const { selectActOccurs, insertActOccurs } = require("./queries");

const getActOccurs = async (req, res) => {
  try {
    const data = { userId: req.params.id };
    const results = await selectActOccurs(data);
    if (results === 500) {
      throw Error("DB 에러");
    }
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

const postActOccurs = async (req, res) => {
  try {
    const { activityName, userId } = req.body;
    const results = await insertActOccurs({ activityName, userId });
    if (results === 500) {
      throw Error("DB 에러");
    }
    res.status(200).json(results.insertId);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    return res.end();
  }
};

module.exports = { getActOccurs, postActOccurs };
