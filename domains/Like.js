class Like {
  #userId;
  #tagId;

  constructor({ userId, tagId }) {
    this.#userId = userId;
    this.#tagId = tagId;
  }

  get userId() {
    return this.#userId;
  }

  set userId(userId) {
    this.#userId = userId;
  }

  get tagId() {
    return this.#tagId;
  }

  set tagId(tagId) {
    this.#tagId = tagId;
  }
}

module.exports = Like;
