const UserRepository = require("../UserRepository");

class MySqlUserRepository extends UserRepository {
  #POOL;

  constructor(container) {
    super();
    this.#POOL = container.get("POOL");
  }

  async save(user) {
    return (
      await this.#POOL.execute(`INSERT INTO Users(email) VALUES(?)`, [
        user.email,
      ])
    )[0].insertId;
  }

  async remove(user) {
    await this.#POOL.execute(`DELETE FROM Users WHERE email=?`, [user.email]);
  }

  async findByEmail(user) {
    return (
      await this.#POOL.execute(`SELECT * FROM Users WHERE email=?`, [
        user.email,
      ])
    )[0][0];
  }

  async findById(user) {
    return (
      await this.#POOL.execute(`SELECT * FROM Users WHERE id=?`, [user.id])
    )[0][0];
  }

  async findAll() {
    return (await this.#POOL.execute(`SELECT * FROM Users`))[0];
  }

  async clear() {
    await this.#POOL.execute(`DELETE FROM Users`);
  }
}

module.exports = MySqlUserRepository;
