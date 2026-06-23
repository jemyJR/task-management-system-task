class HttpException extends Error {
  constructor(status, message, options = {}) {
    super(message);
    this.status = status;
    this.options = options;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestException extends HttpException {
  constructor(message = "Bad Request", options) {
    super(400, message, options);
  }
}

class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized", options) {
    super(401, message, options);
  }
}

class PaymentRequiredException extends HttpException {
  constructor(message = "Payment Required", options) {
    super(402, message, options);
  }
}

class ForbiddenException extends HttpException {
  constructor(message = "Forbidden", options) {
    super(403, message, options);
  }
}

class NotFoundException extends HttpException {
  constructor(message = "Not Found", options) {
    super(404, message, options);
  }
}

class MethodNotAllowedException extends HttpException {
  constructor(message = "Method Not Allowed", options) {
    super(405, message, options);
  }
}

class NotAcceptableException extends HttpException {
  constructor(message = "Not Acceptable", options) {
    super(406, message, options);
  }
}

class RequestTimeoutException extends HttpException {
  constructor(message = "Request Timeout", options) {
    super(408, message, options);
  }
}

class ConflictException extends HttpException {
  constructor(message = "Conflict", options) {
    super(409, message, options);
  }
}

class GoneException extends HttpException {
  constructor(message = "Gone", options) {
    super(410, message, options);
  }
}

class PreconditionFailedException extends HttpException {
  constructor(message = "Precondition Failed", options) {
    super(412, message, options);
  }
}

class PayloadTooLargeException extends HttpException {
  constructor(message = "Payload Too Large", options) {
    super(413, message, options);
  }
}

class UnsupportedMediaTypeException extends HttpException {
  constructor(message = "Unsupported Media Type", options) {
    super(415, message, options);
  }
}

class UnprocessableEntityException extends HttpException {
  constructor(message = "Unprocessable Entity", options) {
    super(422, message, options);
  }
}

class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error", options) {
    super(500, message, options);
  }
}

class NotImplementedException extends HttpException {
  constructor(message = "Not Implemented", options) {
    super(501, message, options);
  }
}

class BadGatewayException extends HttpException {
  constructor(message = "Bad Gateway", options) {
    super(502, message, options);
  }
}

class ServiceUnavailableException extends HttpException {
  constructor(message = "Service Unavailable", options) {
    super(503, message, options);
  }
}

class GatewayTimeoutException extends HttpException {
  constructor(message = "Gateway Timeout", options) {
    super(504, message, options);
  }
}

class HttpVersionNotSupportedException extends HttpException {
  constructor(message = "HTTP Version Not Supported", options) {
    super(505, message, options);
  }
}

class ImATeapotException extends HttpException {
  constructor(message = "I'm a teapot", options) {
    super(418, message, options);
  }
}

class TooManyRequestsException extends HttpException {
  constructor(message = "Too Many Requests", options) {
    super(429, message, options);
  }
}

export {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpException,
  HttpVersionNotSupportedException,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PaymentRequiredException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  TooManyRequestsException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
};
