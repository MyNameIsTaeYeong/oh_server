class WriteError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "WriteError";
  }
}

module.exports = WriteError;
