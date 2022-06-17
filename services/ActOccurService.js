class ActOccurService {
  #actOccurRepository;

  constructor(container) {
    this.#actOccurRepository = container.get("ActivityOccurRepository");
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

  selectRelatedActAndEmo({
    actOccursOfActivity = [],
    emoOccursOfUser = [],
    actOccursOfUser = [],
  }) {
    const targetDateSet = new Set(
      actOccursOfActivity.map((record) => record.date.toLocaleDateString())
    );

    return [
      emoOccursOfUser
        .filter((record) => targetDateSet.has(record.date.toLocaleDateString()))
        .reduce((prev, cur) => {
          prev[cur.emotionName]
            ? prev[cur.emotionName]++
            : (prev[cur.emotionName] = 1);
          return prev;
        }, {}),

      actOccursOfUser
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
