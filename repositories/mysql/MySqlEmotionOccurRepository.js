const ReadError = require("../../errors/ReadError");
const UnexpectedError = require("../../errors/UnexpectedError");
const WriteError = require("../../errors/WriteError");
const RecordOccurRepository = require("../RecordOccurRepository");

class MySqlEmotionOccurRepository extends RecordOccurRepository {
  #POOL;

  constructor(container) {
    super();
    this.#POOL = container.get("POOL");
  }

  async save(emoOccur) {
    try {
      return (
        await this.#POOL.execute(
          `INSERT INTO EmoOccurrences(emotionName, userId, recordId) VALUES(?, ?, ?)`,
          [emoOccur.name, emoOccur.userId, emoOccur.recordId]
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

  async remove(emoOccur) {
    try {
      await this.#POOL.execute(`DELETE FROM EmoOccurrences WHERE id=?`, [
        emoOccur.id,
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

  async findById(emoOccur) {
    return (
      await this.#POOL.execute(`SELECT * FROM EmoOccurrences WHERE id=?`, [
        emoOccur.id,
      ])
    )[0][0];
  }

  async findByUserId(user) {
    try {
      return (
        await this.#POOL.execute(
          `SELECT * FROM EmoOccurrences WHERE userId=?`,
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

  async findByRecordId(emotion) {
    try {
      return (
        await this.#POOL.execute(
          `SELECT * FROM EmoOccurrences WHERE recordId=?`,
          [emotion.id]
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
    await this.#POOL.execute(`DELETE FROM EmoOccurrences`);
  }

  async saveForTest({ emotionName, userId, recordId, date }) {
    await this.#POOL.execute(
      `INSERT INTO EmoOccurrences(emotionName, userId, recordId, date) VALUES(?, ?, ?, ?)`,
      [emotionName, userId, recordId, date]
    );
  }
}

module.exports = MySqlEmotionOccurRepository;
