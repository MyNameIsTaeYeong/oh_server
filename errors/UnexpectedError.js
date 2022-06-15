class UnexpectedError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "UnexpectedError";
  }
}

module.exports = UnexpectedError;
