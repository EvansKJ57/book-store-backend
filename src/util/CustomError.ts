class CustomError extends Error {
  statusCode: number;
  name: string;
  stack?: string;
  constructor(msg: string, statusCode: number, error: Error = new Error()) {
    super(msg);
    this.name = error.name;
    this.statusCode = statusCode;
    this.stack = error.stack;
  }
}

export default CustomError;
