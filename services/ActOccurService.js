class ActOccurService {
  #actOccurRepository;
  #emoOccurRepository;

  constructor(actOccurRepository, emoOccurRepository) {
    this.#actOccurRepository = actOccurRepository;
    this.#emoOccurRepository = emoOccurRepository;
  }

  async createActOccur(actOccur) {
    return await this.#actOccurRepository.save(actOccur);
  }

  async deleteActOccur(actOccur) {
    await this.#actOccurRepository.remove(actOccur);
  }

  async selectActOccurByUserId(user) {
    return await this.#actOccurRepository.findAll(user);
  }

  async selectActOccurByRecordId(activity) {
    return await this.#actOccurRepository.findByRecordId(activity);
  }

  async selectRelatedActAndEmo(activity, user) {
    const targetDateSet = new Set(
      (await this.#actOccurRepository.findByRecordId(activity)).map((record) =>
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

module.exports = ActOccurService;
