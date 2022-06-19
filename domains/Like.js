class Like {
  #userId;
  #tagId;

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
