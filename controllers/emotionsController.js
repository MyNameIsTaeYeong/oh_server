const { slavePOOL, masterPOOL } = require("../db");

const getEmotions = async (req, res) => {
  try {
    const results = await slavePOOL.execute(
      "SELECT * FROM Emotions WHERE userId=?",
      [req.params.id]
    );
    const rtn = {
      code: 200,
      results: results[0],
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

const postEmotions = async (req, res) => {
  try {
    const { name, userId } = req.body;
    const results = await masterPOOL.execute(
      "INSERT INTO Emotions(name, userId) VALUES(?, ?)",
      [name, userId]
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

const deleteEmotions = async (req, res) => {
  try {
    await masterPOOL.execute("DELETE FROM Emotions where id=?", [
      req.params.id,
    ]);
    const rtn = {
      code: 200,
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

module.exports = { getEmotions, postEmotions, deleteEmotions };
