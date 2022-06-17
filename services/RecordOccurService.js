const ArgumentError = require("../errors/ArgumentError");

class RecordOccurService {
  #recordOccurRepository;

  constructor(container) {
    this.#recordOccurRepository = container.get("RecordOccurRepository");
  }

  // actOccur
  // #id;
  // #date;
  // #name;
  // #userId;
  // #recordId;
  async createRecordOccur(recordOccur = {}) {
    if (!recordOccur.name)
      throw new ArgumentError("recordOccur.name is not defined");
    if (!recordOccur.userId)
      throw new ArgumentError("recordOccur.userId is not defined");
    if (!recordOccur.recordId)
      throw new ArgumentError("recordOccur.recordId is not defined");
    return await this.#recordOccurRepository.save(recordOccur);
  }

  async deleteRecordOccur(recordOccur = {}) {
    if (!recordOccur.id)
      throw new ArgumentError("recordOccur.id is not defined");
    if (!recordOccur.name)
      throw new ArgumentError("recordOccur.name is not defined");
    if (!recordOccur.userId)
      throw new ArgumentError("recordOccur.userId is not defined");
    if (!recordOccur.recordId)
      throw new ArgumentError("recordOccur.recordId is not defined");
    await this.#recordOccurRepository.remove(recordOccur);
  }
  // User
  // #id;
  // #email;
  async selectRecordOccurByUserId(user = {}) {
    if (!user.id) throw new ArgumentError("user.id is not defined");
    if (!user.email) throw new ArgumentError("user.email is not defined");
    return await this.#recordOccurRepository.findAll(user);
  }

  // Activity
  // #id;
  // #name;
  // #userId;
  async selectRecordOccurByRecordId(record = {}) {
    if (!record.id) throw new ArgumentError("record.id is not defined");
    if (!record.name) throw new ArgumentError("record.name is not defined");
    if (!record.userId) throw new ArgumentError("record.userId is not defined");
    return await this.#recordOccurRepository.findByRecordId(record);
  }

  selectRelatedEmoAndAct({
    targetRecordOccurs = [],
    emoOccursOfUser = [],
    actOccursOfUser = [],
  }) {
    const targetDateSet = new Set(
      targetRecordOccurs.map((record) => record.date.toLocaleDateString())
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

module.exports = RecordOccurService;
