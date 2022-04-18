const { getConnection } = require("../db");

const postLikes = async (req, res) => {
  const conn = await getConnection();
  if (conn === -1) {
    res.status(500);
    return res.end();
  }

  try {
    conn.beginTransaction();
    const curLikeCnt = await conn.execute(
      `SELECT likeCnt FROM ShareTags WHERE id=? FOR UPDATE`,
      [req.body.tagId]
    );

    conn.execute(`UPDATE ShareTags SET likeCnt=? WHERE id=?`, [
      curLikeCnt[0][0].likeCnt + Number(req.body.cnt),
      req.body.tagId,
    ]);

    await conn.execute(`INSERT INTO Likes(tagId, userId) VALUES(?, ?)`, [
      req.body.tagId,
      req.body.userId,
    ]);

    await conn.commit();
  } catch (error) {
    console.log(error);
    await conn.rollback();
    res.status(500);
  } finally {
    conn.release();
    return res.end();
  }
};

module.exports = { postLikes };
