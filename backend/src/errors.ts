export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ApiError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static internal(message: string) {
    return new ApiError(500, message);
  }
}
