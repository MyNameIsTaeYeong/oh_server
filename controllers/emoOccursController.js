const { selectEmoOccurs, insertEmoOccurs } = require("./queries");

const getEmoOccurs = async (req, res) => {
  try {
    const data = { userId: req.params.id };
    const results = await selectEmoOccurs(data);
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

const postEmoOccurs = async (req, res) => {
  try {
    const { emotionName, userId } = req.body;
    const results = await insertEmoOccurs({ emotionName, userId });
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

module.exports = { getEmoOccurs, postEmoOccurs };
