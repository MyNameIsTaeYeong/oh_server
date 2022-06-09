const RecordOccurRepository = require("../RecordOccurRepository");

class MySqlEmotionOccurRepository extends RecordOccurRepository {
  #POOL;

  constructor(POOL) {
    super();
    this.#POOL = POOL;
  }

  async save(emoOccur) {
    return (
      await this.#POOL.execute(
        `INSERT INTO EmoOccurrences(emotionName, userId, recordId) VALUES(?, ?, ?)`,
        [emoOccur.name, emoOccur.userId, emoOccur.recordId]
      )
    )[0].insertId;
  }

  async remove(emoOccur) {
    await this.#POOL.execute(`DELETE FROM EmoOccurrences WHERE id=?`, [
      emoOccur.id,
    ]);
  }

  async findById(emoOccur) {
    return (
      await this.#POOL.execute(`SELECT * FROM EmoOccurrences WHERE id=?`, [
        emoOccur.id,
      ])
    )[0][0];
  }

  async findByUserId(user) {
    return (
      await this.#POOL.execute(`SELECT * FROM EmoOccurrences WHERE userId=?`, [
        user.id,
      ])
    )[0];
  }

  async findByRecordId(activity) {
    return (
      await this.#POOL.execute(
        `SELECT * FROM EmoOccurrences WHERE recordId=?`,
        [activity.id]
      )
    )[0];
  }

  async clear() {
    await this.#POOL.execute(`DELETE FROM EmoOccurrences`);
  }
}

module.exports = MySqlEmotionOccurRepository;
