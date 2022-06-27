const ReadError = require("../../errors/ReadError");
const UnexpectedError = require("../../errors/UnexpectedError");
const WriteError = require("../../errors/WriteError");
const UserRepository = require("../UserRepository");

class MySqlUserRepository extends UserRepository {
  #POOL;

  constructor(container) {
    super();
    this.#POOL = container.get("POOL");
  }

  async save(user) {
    try {
      const userId = (
        await this.#POOL.execute(`INSERT INTO Users(email) VALUES(?)`, [
          user.email,
        ])
      )[0].insertId;

      await Promise.all([
        this.#POOL.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
          "기쁨",
          userId,
        ]),
        this.#POOL.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
          "화남",
          userId,
        ]),
        this.#POOL.execute(`INSERT INTO Emotions(name, userId) VALUES(?,?)`, [
          "슬픔",
          userId,
        ]),
        this.#POOL.execute(
          `INSERT INTO Activities(name, userId) VALUES(?, ?)`,
          ["운동", userId]
        ),
        this.#POOL.execute(
          `INSERT INTO Activities(name, userId) VALUES(?, ?)`,
          ["독서", userId]
        ),
        this.#POOL.execute(
          `INSERT INTO Activities(name, userId) VALUES(?, ?)`,
          ["설거지", userId]
        ),
      ]);

      return userId;
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

  async remove(user) {
    try {
      await this.#POOL.execute(`DELETE FROM Users WHERE email=?`, [user.email]);
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

  async findByEmail(user) {
    try {
      return (
        await this.#POOL.execute(`SELECT * FROM Users WHERE email=?`, [
          user.email,
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

  async findById(user) {
    try {
      return (
        await this.#POOL.execute(`SELECT * FROM Users WHERE id=?`, [user.id])
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

  async findAll() {
    try {
      return (await this.#POOL.execute(`SELECT * FROM Users`))[0];
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
    await this.#POOL.execute(`DELETE FROM Users`);
  }

  async saveForTest(user) {
    return (
      await this.#POOL.execute(`INSERT INTO Users(email) VALUES(?)`, [
        user.email,
      ])
    )[0].insertId;
  }
}

module.exports = MySqlUserRepository;
