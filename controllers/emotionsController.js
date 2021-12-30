const { selectEmotions, insertEmotions } = require("./queries");

const getEmotions = async (req, res) => {
  try {
    const data = { userId: req.params.id };
    const results = await selectEmotions(data);
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

const postEmotions = async (req, res) => {
  try {
    const { name, userId } = req.body;
    const results = await insertEmotions({ name, userId });
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

module.exports = { getEmotions, postEmotions };
