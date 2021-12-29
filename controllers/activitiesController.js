const { selectActivities } = require("./queries");

const getActivities = async (req, res) => {
  try {
    const data = { userId: req.params.id };
    const results = await selectActivities(data);
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

module.exports = { getActivities };
