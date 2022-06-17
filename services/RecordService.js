const ArgumentError = require("../errors/ArgumentError");

class RecordService {
  #recordRepository;

  constructor(container) {
    this.#recordRepository = container.get("RecordRepository");
  }

  //activity id, name, userId
  //emotion id, name, userId
  async createRecord(record = {}) {
    if (!record.name) throw new ArgumentError("record name is undefined");
    if (!record.userId) throw new ArgumentError("record userId is undefined");

    return await this.#recordRepository.save(record);
  }

  //activity id, name, userId
  //emotion id, name, userId
  async deleteRecord(record = {}) {
    if (!record.id) throw new ArgumentError("record id is undefined");
    if (!record.name) throw new ArgumentError("record name is undefined");
    if (!record.userId) throw new ArgumentError("record userId is undefined");

    await this.#recordRepository.remove(record);
  }

  async selectRecords(user = {}) {
    // user id, email
    if (!user.id) throw new ArgumentError("user id is undefined");
    if (!user.email) throw new ArgumentError("user email is undefined");
    return await this.#recordRepository.findAll(user);
  }
}

module.exports = RecordService;
