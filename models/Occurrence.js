class Occurrence {
  constructor(id, recordValue, recordDate, recordId) {
    this.id = id;
    this.recordValue = recordValue;
    this.recordDate = recordDate;
    this.recordId = recordId;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get recordValue() {
    return this._recordValue;
  }

  set recordValue(recordValue) {
    this._recordValue = recordValue;
  }

  get recordDate() {
    return this._recordDate;
  }

  set recordDate(recordDate) {
    this._recordDate = recordDate;
  }

  get recordId() {
    return this._recordId;
  }

  set recordId(recordId) {
    this._recordId = recordId;
  }
}

export default Occurrence;
