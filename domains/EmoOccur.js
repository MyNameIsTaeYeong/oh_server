class EmoOccur {
  #id;
  #date;
  #name;
  #userId;
  #recordId;

  constructor({ id, date, name, userId, recordId }) {
    this.#id = id;
    this.#date = date;
    this.#name = name;
    this.#userId = userId;
    this.#recordId = recordId;
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    this.#id = id;
  }

  get date() {
    return this.#date;
  }

  set date(date) {
    this.#date = date;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;
  }

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    this.#userId = userId;
  }

  get recordId() {
    return this.#recordId;
  }

  set recordId(recordId) {
    this.#recordId = recordId;
  }
}

module.exports = EmoOccur;
