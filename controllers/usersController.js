const POOL = require("../db");

const getUsers = async (req, res) => {
  try {
    const { QUERY, EQ } = POOL;
    const results = await QUERY`SELECT * FROM users WHERE ${EQ({
      id: req.params.id,
    })}`;
    res.status(200).json(results[0].email);
  } catch (error) {
    console.log(error);
    res.status(500);
  } finally {
    POOL.END();
    return res.end();
  }
};

module.exports = { getUsers };
