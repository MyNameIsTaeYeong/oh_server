const UserRepository = require("./UserRepository");

class MySqlUserRepository extends UserRepository {
  #POOL;

  constructor(POOL) {
    super();
    this.#POOL = POOL;
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
}

module.exports = MySqlUserRepository;
