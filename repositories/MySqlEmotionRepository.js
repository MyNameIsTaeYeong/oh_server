const RecordRepository = require("./RecordRepository");

class MySqlEmotionRepository extends RecordRepository {
  #POOL;

  constructor(POOL) {
    super();
    this.#POOL = POOL;
  }

  async save(emotion) {
    return (
      await this.#POOL.execute(
        `INSERT INTO Emotions(name, userId) VALUES(?, ?)`,
        [emotion.name, emotion.userId]
      )
    )[0].insertId;
  }

  async remove(emotion) {
    await this.#POOL.execute(`DELETE FROM Emotions WHERE id=?`, [emotion.id]);
  }

  async findAll(user) {
    return (
      await this.#POOL.execute(`SELECT * FROM Emotions WHERE userId=?`, [
        user.id,
      ])
    )[0];
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
