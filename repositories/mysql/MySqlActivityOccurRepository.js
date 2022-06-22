const ReadError = require("../../errors/ReadError");
const UnexpectedError = require("../../errors/UnexpectedError");
const WriteError = require("../../errors/WriteError");
const RecordOccurRepository = require("../RecordOccurRepository");

class MySqlActivityOccurRepository extends RecordOccurRepository {
  #POOL;

  constructor(container) {
    super();
    this.#POOL = container.get("POOL");
  }

  async save(actOccur) {
    try {
      return (
        await this.#POOL.execute(
          `INSERT INTO ActOccurrences(activityName, userId, recordId) VALUES(?, ?, ?)`,
          [actOccur.name, actOccur.userId, actOccur.recordId]
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

  async remove(actOccur) {
    try {
      await this.#POOL.execute(`DELETE FROM ActOccurrences WHERE id=?`, [
        actOccur.id,
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

  async findById(actOccur) {
    try {
      return (
        await this.#POOL.execute(`SELECT * FROM ActOccurrences WHERE id=?`, [
          actOccur.id,
        ])
      )[0][0];
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

  async findByUserId(user) {
    try {
      return (
        await this.#POOL.execute(
          `SELECT id, data, activityName as name, userId, recordId  FROM ActOccurrences WHERE userId=?`,
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

  async findByRecordId(activity) {
    try {
      return (
        await this.#POOL.execute(
          `SELECT * FROM ActOccurrences WHERE recordId=?`,
          [activity.id]
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
    await this.#POOL.execute(`DELETE FROM ActOccurrences`);
  }

  async saveForTest({ activityName, userId, recordId, date }) {
    await this.#POOL.execute(
      `INSERT INTO ActOccurrences(activityName, userId, recordId, date) VALUES(?, ?, ?, ?)`,
      [activityName, userId, recordId, date]
    );
  }
}

module.exports = MySqlActivityOccurRepository;
