class DuplicatedError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "DuplicatedError";
  }
}

module.exports = DuplicatedError;
