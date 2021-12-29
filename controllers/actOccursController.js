const { selectActOccurs } = require("./queries");

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

module.exports = { getActOccurs };
