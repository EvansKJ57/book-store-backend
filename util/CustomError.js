class CustomError extends Error {
  constructor(msg, statusCode, error) {
    super(msg);
    this.statusCode = statusCode || 500;
    this.stack = error.stack || null;
  }
}

module.exports = CustomError;
