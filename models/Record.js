class Record {
  constructor(id, userId, recordName, occurrences) {
    this.id = id;
    this.userId = userId;
    this.recordName = recordName;
    this.occurrences = occurrences;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get userId() {
    return this._userId;
  }

  set userId(userId) {
    this._userId = userId;
  }

  get recordName() {
    return this._recordName;
  }

  set recordName(recordName) {
    this._recordName = recordName;
  }

  get occurrences() {
    return this._occurrences;
  }

  set occurrences(occurrences) {
    this._occurrences = occurrences;
  }
}
export default Record;
