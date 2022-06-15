const ReadError = require("../../errors/ReadError");
const UnexpectedError = require("../../errors/UnexpectedError");
const WriteError = require("../../errors/WriteError");
const RecordRepository = require("../RecordRepository");

class MySqlActivityRepository extends RecordRepository {
  #POOL;

  constructor(container) {
    super();
    this.#POOL = container.get("POOL");
  }

  async save(activity) {
    try {
      return (
        await this.#POOL.execute(
          `INSERT INTO Activities(name, userId) VALUES(?, ?)`,
          [activity.name, activity.userId]
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

  async remove(activity) {
    try {
      await this.#POOL.execute(`DELETE FROM Activities WHERE id=?`, [
        activity.id,
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

  async findAll(user) {
    try {
      return (
        await this.#POOL.execute(`SELECT * FROM Activities WHERE userId=?`, [
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

  async findById(activity) {
    return (
      await this.#POOL.execute(`SELECT * FROM Activities WHERE id=?`, [
        activity.id,
      ])
    )[0][0];
  }

  async clear() {
    await this.#POOL.execute(`DELETE FROM Activities`);
  }
}

module.exports = MySqlActivityRepository;
