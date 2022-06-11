class EmoOccurService {
  #emoOccurRepository;
  #actOccurRepository;

  constructor(emoOccurRepository, actOccurRepository) {
    this.#emoOccurRepository = emoOccurRepository;
    this.#actOccurRepository = actOccurRepository;
  }

  async createEmoOccur(emoOccur) {
    return await this.#emoOccurRepository.save(emoOccur);
  }

  async deleteEmoOccur(emoOccur) {
    await this.#emoOccurRepository.remove(emoOccur);
  }

  async selectEmoOccurByUserId(user) {
    return await this.#emoOccurRepository.findAll(user);
  }

  async selectEmoOccurByRecordId(emotion) {
    return await this.#emoOccurRepository.findByRecordId(emotion);
  }

  async selectRelatedEmoAndAct(emotion, user) {
    const targetDateSet = new Set(
      (await this.#emoOccurRepository.findByRecordId(emotion)).map((record) =>
        record.date.toLocaleDateString()
      )
    );

    return [
      (await this.#emoOccurRepository.findByUserId(user))
        .filter((record) => targetDateSet.has(record.date.toLocaleDateString()))
        .reduce((prev, cur) => {
          prev[cur.emotionName]
            ? prev[cur.emotionName]++
            : (prev[cur.emotionName] = 1);
          return prev;
        }, {}),

      (await this.#actOccurRepository.findByUserId(user))
        .filter((record) => targetDateSet.has(record.date.toLocaleDateString()))
        .reduce((prev, cur) => {
          prev[cur.activityName]
            ? prev[cur.activityName]++
            : (prev[cur.activityName] = 1);
          return prev;
        }, {}),
    ];
  }
}

module.exports = EmoOccurService;
