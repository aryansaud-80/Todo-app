class ApiError extends Error {
  constructor(statusCode, message = 'An error occurred') {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.data = null;
  }
}

export { ApiError };
