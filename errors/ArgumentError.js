class ArgumentError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "ArgumentError";
  }
}

module.exports = ArgumentError;
