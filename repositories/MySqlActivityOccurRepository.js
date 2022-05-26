const RecordOccurRepository = require("./RecordOccurRepository");

class MySqlActivityOccurRepository extends RecordOccurRepository {
  #POOL;

  constructor(POOL) {
    super();
    this.#POOL = POOL;
  }

  async save(actOccur) {
    return (
      await this.#POOL.execute(
        `INSERT INTO ActOccurrences(activityName, userId, recordId) VALUES(?, ?, ?)`,
        [actOccur.name, actOccur.userId, actOccur.recordId]
      )
    )[0].insertId;
  }

  async remove(actOccur) {
    await this.#POOL.execute(`DELETE FROM ActOccurrences WHERE id=?`, [
      actOccur.id,
    ]);
  }

  async findById(actOccur) {
    return (
      await this.#POOL.execute(`SELECT * FROM ActOccurrences WHERE id=?`, [
        actOccur.id,
      ])
    )[0][0];
  }

  async findByUserId(user) {
    return (
      await this.#POOL.execute(`SELECT * FROM ActOccurrences WHERE userId=?`, [
        user.id,
      ])
    )[0];
  }

  async findByRecordId(activity) {
    return (
      await this.#POOL.execute(
        `SELECT * FROM ActOccurrences WHERE recordId=?`,
        [activity.id]
      )
    )[0];
  }

  async clear() {
    await this.#POOL.execute(`DELETE FROM ActOccurrences`);
  }
}

module.exports = MySqlActivityOccurRepository;
