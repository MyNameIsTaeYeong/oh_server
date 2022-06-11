class Activity {
  #id;
  #name;
  #userId;

  constructor(name, userId) {
    this.#name = name;
    this.#userId = userId;
  }

  set id(id) {
    this.#id = id;
  }

  get id() {
    return this.#id;
  }

  set name(name) {
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  set userId(userId) {
    this.#userId = userId;
  }

  get userId() {
    return this.#userId;
  }
}

module.exports = Activity;
