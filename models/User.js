class User {
  constructor(id, email, records) {
    this.id = id;
    this.email = email;
    this.records = records;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set email(email) {
    this._email = email;
  }

  get email() {
    return this._email;
  }

  set records(records) {
    this._records = records;
  }

  get records() {
    return this._records;
  }
}

module.exports = User;
