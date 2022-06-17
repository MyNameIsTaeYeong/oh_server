const ArgumentError = require("../errors/ArgumentError");

class ActOccurService {
  #actOccurRepository;

  constructor(container) {
    this.#actOccurRepository = container.get("ActivityOccurRepository");
  }
  // actOccur
  // #id;
  // #date;
  // #name;
  // #userId;
  // #recordId;
  async createActOccur(actOccur = {}) {
    if (!actOccur.name) throw new ArgumentError("actOccur.name is not defined");
    if (!actOccur.userId)
      throw new ArgumentError("actOccur.userId is not defined");
    if (!actOccur.recordId)
      throw new ArgumentError("actOccur.recordId is not defined");
    return await this.#actOccurRepository.save(actOccur);
  }

  async deleteActOccur(actOccur = {}) {
    if (!actOccur.id) throw new ArgumentError("actOccur.id is not defined");
    if (!actOccur.name) throw new ArgumentError("actOccur.name is not defined");
    if (!actOccur.userId)
      throw new ArgumentError("actOccur.userId is not defined");
    if (!actOccur.recordId)
      throw new ArgumentError("actOccur.recordId is not defined");
    await this.#actOccurRepository.remove(actOccur);
  }
  // User
  // #id;
  // #email;
  async selectActOccurByUserId(user = {}) {
    if (!user.id) throw new ArgumentError("user.id is not defined");
    if (!user.email) throw new ArgumentError("user.email is not defined");
    return await this.#actOccurRepository.findAll(user);
  }

  // Activity
  // #id;
  // #name;
  // #userId;
  async selectActOccurByRecordId(activity = {}) {
    if (!activity.id) throw new ArgumentError("activity.id is not defined");
    if (!activity.name) throw new ArgumentError("activity.name is not defined");
    if (!activity.userId)
      throw new ArgumentError("activity.userId is not defined");
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
