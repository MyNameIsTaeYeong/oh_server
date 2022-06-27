const ReadError = require("../../errors/ReadError");
const UnexpectedError = require("../../errors/UnexpectedError");
const WriteError = require("../../errors/WriteError");

class MySqlLikeRepository {
  #POOL;

  constructor(container) {
    this.#POOL = container.get("POOL");
  }

  async save(like) {
    try {
      await this.#POOL.execute(
        `INSERT INTO Likes(tagId, userId) VALUES(?, ?)`,
        [like.tagId, like.userId]
      );
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

  async remove(like) {
    try {
      await this.#POOL.execute(`DELETE FROM Likes WHERE tagId=? AND userId=?`, [
        like.tagId,
        like.userId,
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

  async findByUserId(user) {
    try {
      return (
        await this.#POOL.execute(
          `SELECT *
           FROM Likes 
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

  async clear() {
    await this.#POOL.execute(`DELETE FROM Likes`);
  }
}

module.exports = MySqlLikeRepository;
