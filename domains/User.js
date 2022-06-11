class User {
  #id;
  #email;

  constructor(email) {
    this.#email = email;
  }

  set id(id) {
    this.#id = id;
  }

  get id() {
    return this.#id;
  }

  set email(email) {
    this.#email = email;
  }

  get email() {
    return this.#email;
  }
}

module.exports = User;
