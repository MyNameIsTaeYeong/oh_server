class ShareTag {
  #id;
  #content;
  #userId;

  constructor({ id, content, userId }) {
    this.#id = id;
    this.#content = content;
    this.#userId = userId;
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    this.#id = id;
  }

  get content() {
    return this.#content;
  }

  set content(content) {
    this.#content = content;
  }

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    this.#userId = userId;
  }
}

module.exports = ShareTag;
