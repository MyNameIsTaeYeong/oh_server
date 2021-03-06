const ReadError = require("../../errors/ReadError");
const UnexpectedError = require("../../errors/UnexpectedError");
const WriteError = require("../../errors/WriteError");
const RecordRepository = require("../RecordRepository");

class MySqlShareTagRepository extends RecordRepository {
  #POOL;

  constructor(container) {
    super();
    this.#POOL = container.get("POOL");
  }

  async save(shareTag = {}) {
    try {
      return (
        await this.#POOL.execute(
          "INSERT INTO ShareTags(content, userId) VALUES(?, ?)",
          [shareTag.content, shareTag.userId]
        )
      )[0].insertId;
    } catch (error) {
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR":
          throw new WriteError("MySql Server Error", error);
        case "ECONNREFUSED":
          throw new WriteError("Nodejs Error", error);
        case "PROTOCOL_CONNECTION_LOST":
          throw new WriteError("Connection Lost", error);
        default:
          throw new UnexpectedError("UnexpectedError", error);
      }
    }
  }

  async remove(shareTag = {}) {
    try {
      await this.#POOL.execute(`DELETE FROM ShareTags WHERE id=?`, [
        shareTag.id,
      ]);
    } catch (error) {
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR":
          throw new WriteError("MySql Server Error", error);
        case "ECONNREFUSED":
          throw new WriteError("Nodejs Error", error);
        case "PROTOCOL_CONNECTION_LOST":
          throw new WriteError("Connection Lost", error);
        default:
          throw new UnexpectedError("UnexpectedError", error);
      }
    }
  }

  async findAll({ user, page }) {
    try {
      return (
        await this.#POOL.execute(
          `SELECT id, content, likeCnt, ShareTags.userId, tagId as myLike
             FROM ShareTags LEFT JOIN Likes
             ON Likes.userId=? AND ShareTags.id = Likes.tagId
             LIMIT ${Number(page) * 20}, 20`,
          [user.id]
        )
      )[0];
    } catch (error) {
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR":
          throw new ReadError("MySql Server Error", error);
        case "ECONNREFUSED":
          throw new ReadError("Nodejs Error", error);
        case "PROTOCOL_CONNECTION_LOST":
          throw new ReadError("Connection Lost", error);
        default:
          throw new UnexpectedError("UnexpectedError", error);
      }
    }
  }

  async findById() {}

  async findByUserId(user) {
    try {
      return (
        await this.#POOL.execute(
          `SELECT *
           FROM ShareTags 
           WHERE userId=?`,
          [user.id]
        )
      )[0];
    } catch (error) {
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR":
          throw new ReadError("MySql Server Error", error);
        case "ECONNREFUSED":
          throw new ReadError("Nodejs Error", error);
        case "PROTOCOL_CONNECTION_LOST":
          throw new ReadError("Connection Lost", error);
        default:
          throw new UnexpectedError("UnexpectedError", error);
      }
    }
  }

  async setLikeCnt({ shareTag, nextCnt }) {
    try {
      await this.#POOL.execute(`UPDATE ShareTags SET likeCnt=? WHERE id=?`, [
        nextCnt,
        shareTag.id,
      ]);
    } catch (error) {
      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR":
          throw new WriteError("MySql Server Error", error);
        case "ECONNREFUSED":
          throw new WriteError("Nodejs Error", error);
        case "PROTOCOL_CONNECTION_LOST":
          throw new WriteError("Connection Lost", error);
        default:
          throw new UnexpectedError("UnexpectedError", error);
      }
    }
  }

  // ???????????????
  async updateLikeCnt({ shareTag, cnt }) {
    let conn;

    try {
      conn = await this.#POOL.getConnection();
      conn.beginTransaction();

      const curLikeCnt = await conn.execute(
        `SELECT likeCnt FROM ShareTags WHERE id=? FOR UPDATE`,
        [shareTag.id]
      );

      conn.execute(`UPDATE ShareTags SET likeCnt=? WHERE id=?`, [
        curLikeCnt[0][0].likeCnt + Number(cnt),
        shareTag.id,
      ]);

      await conn.commit();
    } catch (error) {
      await conn.rollback();

      switch (error.code) {
        case "ER_ACCESS_DENIED_ERROR":
          throw new WriteError("MySql Server Error", error);
        case "ECONNREFUSED":
          throw new WriteError("Nodejs Error", error);
        case "PROTOCOL_CONNECTION_LOST":
          throw new WriteError("Connection Lost", error);
        default:
          throw new UnexpectedError("UnexpectedError", error);
      }
    } finally {
      conn.release();
    }
  }

  async clear() {
    await this.#POOL.execute(`DELETE FROM ShareTags`);
  }
}

module.exports = MySqlShareTagRepository;
