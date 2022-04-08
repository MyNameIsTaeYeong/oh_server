const POOL = require("../db");

const getShareTags = async (req, res) => {
  try {
    const page = Number(req.query.page) * 100;
    const results = await POOL.execute(
      `SELECT id, content, likeCnt, ShareTags.userId, tagId as myLike
       FROM ShareTags 
       LEFT JOIN Likes
       ON Likes.userId=? 
       AND ShareTags.id = Likes.tagId
       LIMIT ${page}, 100`,
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

const postShareTags = async (req, res) => {
  try {
    const { content, userId } = req.body;
    const results = await POOL.execute(
      "INSERT INTO ShareTags(content, userId) VALUES(?, ?)",
      [content, userId]
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

module.exports = { postShareTags, getShareTags };
