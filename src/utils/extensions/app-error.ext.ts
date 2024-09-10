export class AppError extends Error {
  public status: number;
  public source: string;

  constructor(message: string, status: number, source: string) {
    super(message);
    this.status = status;
    this.source = source;

    // Ensure the name of this error is the same as the class name
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

