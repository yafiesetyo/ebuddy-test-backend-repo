import { NextFunction, Request, Response } from "express";

class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  message: string;

  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.message = message;
    // Ensure the correct prototype chain is maintained
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

const errHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode: number = err.statusCode;
  const errMsg: string = err.message || "something went wrong";

  res.status(statusCode).json({
    status: statusCode,
    message: errMsg,
  });
};

export { ApiError, errHandler };
