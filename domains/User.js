class User {
  #id;
  #email;

  constructor({ id, email }) {
    this.#email = email;
    this.#id = id;
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
