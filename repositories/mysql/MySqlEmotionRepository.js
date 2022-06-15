const ReadError = require("../../errors/ReadError");
const UnexpectedError = require("../../errors/UnexpectedError");
const WriteError = require("../../errors/WriteError");
const RecordRepository = require("../RecordRepository");

class MySqlEmotionRepository extends RecordRepository {
  #POOL;

  constructor(container) {
    super();
    this.#POOL = container.get("POOL");
  }

  async save(emotion) {
    try {
      return (
        await this.#POOL.execute(
          `INSERT INTO Emotions(name, userId) VALUES(?, ?)`,
          [emotion.name, emotion.userId]
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

  async remove(emotion) {
    try {
      await this.#POOL.execute(`DELETE FROM Emotions WHERE id=?`, [emotion.id]);
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

  async findAll(user) {
    try {
      return (
        await this.#POOL.execute(`SELECT * FROM Emotions WHERE userId=?`, [
          user.id,
        ])
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

  async findById(emotion) {
    return (
      await this.#POOL.execute(`SELECT * FROM Emotions WHERE id=?`, [
        emotion.id,
      ])
    )[0][0];
  }

  async clear() {
    await this.#POOL.execute(`DELETE FROM Emotions`);
  }
}

module.exports = MySqlEmotionRepository;
