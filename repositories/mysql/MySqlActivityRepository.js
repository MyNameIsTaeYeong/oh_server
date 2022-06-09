const RecordRepository = require("../RecordRepository");

class MySqlActivityRepository extends RecordRepository {
  #POOL;

  constructor(POOL) {
    super();
    this.#POOL = POOL;
  }

  async save(activity) {
    return (
      await this.#POOL.execute(
        `INSERT INTO Activities(name, userId) VALUES(?, ?)`,
        [activity.name, activity.userId]
      )
    )[0].insertId;
  }

  async remove(activity) {
    await this.#POOL.execute(`DELETE FROM Activities WHERE id=?`, [
      activity.id,
    ]);
  }

  async findAll(user) {
    return (
      await this.#POOL.execute(`SELECT * FROM Activities WHERE userId=?`, [
        user.id,
      ])
    )[0];
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
