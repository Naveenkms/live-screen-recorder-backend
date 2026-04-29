class ApiError extends Error {
  public status: number;
  public errors: unknown;
  constructor(status: number, message: string, errors: unknown = null) {
    super(message);
    this.status = status;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
