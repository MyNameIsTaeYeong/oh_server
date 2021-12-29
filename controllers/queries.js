const POOL = require("../db");

const selectUsers = async (data) => {
  try {
    const { QUERY, EQ } = POOL;
    const rtn = await QUERY`SELECT * FROM users WHERE ${EQ(data)}`;
    return rtn;
  } catch (error) {
    console.log(error);
    return 500;
  } finally {
    POOL.END();
  }
};

const selectEmotions = async (data) => {
  try {
    const { QUERY, EQ } = POOL;
    const rtn = await QUERY`SELECT * FROM Emotions WHERE ${EQ(data)}`;
    return rtn;
  } catch (error) {
    console.log(error);
    return 500;
  } finally {
    POOL.END();
  }
};

const selectActivities = async (data) => {
  try {
    const { QUERY, EQ } = POOL;
    const rtn = await QUERY`SELECT * FROM Activities WHERE ${EQ(data)}`;
    return rtn;
  } catch (error) {
    console.log(error);
    return 500;
  } finally {
    POOL.END();
  }
};

const selectEmoOccurs = async (data) => {
  try {
    const { QUERY, EQ } = POOL;
    const rtn = await QUERY`SELECT * FROM EmoOccurrences WHERE ${EQ(data)}`;
    return rtn;
  } catch (error) {
    console.log(error);
    return 500;
  } finally {
    POOL.END();
  }
};

const selectActOccurs = async (data) => {
  try {
    const { QUERY, EQ } = POOL;
    const rtn = await QUERY`SELECT * FROM ActOccurrences WHERE ${EQ(data)}`;
    return rtn;
  } catch (error) {
    console.log(error);
    return 500;
  } finally {
    POOL.END();
  }
};

module.exports = {
  selectUsers,
  selectEmotions,
  selectActivities,
  selectEmoOccurs,
  selectActOccurs,
};
