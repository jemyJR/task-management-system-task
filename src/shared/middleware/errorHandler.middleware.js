import { DEFAULT_DEVELOPMENT } from "../../constants/shared.constants.js";
import config from "../config/config.js";
import { HttpException } from "../exceptions/http.exceptions.js";
import logger from "../utils/logger.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let status, message, options;
  const logMetadata = {
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  };

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation Error";
    const errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});

    options = { details: errors };

    logger.warn(err, {
      ...logMetadata,
      errorType: "ValidationError",
      validationErrors: errors,
    });
  }

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  else if (err.name === "CastError" && err.kind === "ObjectId") {
    status = 400;
    message = "Validation Error";

    const details = {
      [err.path]: `Invalid ${err.path} format`,
    };

    options = { details };

    logger.warn(`Mongoose CastError: Invalid ${err.path} '${err.value}'`, {
      ...logMetadata,
      errorType: "CastError",
      validationErrors: details,
    });
  }

  // Handle MongoDB Duplicate Key Error
  else if (err.name === "MongoServerError" && err.code === 11000) {
    status = 409;
    message = "Duplicate key error";
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const conflict = {
      field,
      value,
      message: `The ${field} '${value}' is already in use`,
    };
    options = { conflict };

    logger.warn(err, {
      ...logMetadata,
      errorType: "MongoDBDuplicateKey",
      conflictingField: field,
      conflictingValue: value,
    });
  }
  // Handle custom HTTP exceptions
  else if (err instanceof HttpException) {
    status = err.status;
    message = err.message;
    options = err.options;

    const logLevel = status >= 500 ? "error" : "warn";
    logger[logLevel](`HTTP Exception: ${message}`, {
      ...logMetadata,
      statusCode: status,
      errorType: "HttpException",
      stack: config.NODE_ENV === DEFAULT_DEVELOPMENT ? err.stack : undefined,
    });
  }
  // Handle all other errors
  else {
    status = 500;
    message = "Internal Server Error";
    options = {};

    logger.error("Unexpected Server Error", {
      ...logMetadata,
      errorType: "InternalServerError",
      errorMessage: err.message,
      stack: config.NODE_ENV === DEFAULT_DEVELOPMENT ? err.stack : undefined,
    });
  }

  // Override message with the first detail if available
  if (options?.details && typeof options.details === "object") {
    const firstKey = Object.keys(options.details)[0];
    message = options.details[firstKey];
  } else if (options?.errors && typeof options.errors === "object") {
    const firstKey = Object.keys(options.errors)[0];
    message = options.errors[firstKey];
  } else if (options?.conflict && options.conflict.message) {
    message = options.conflict.message;
  }

  // Construct error response
  const errorResponse = {
    status,
    message,
    timestamp: logMetadata.timestamp,
    ...(config.NODE_ENV === DEFAULT_DEVELOPMENT && { stack: err.stack }),
    ...options,
  };

  res.status(status).json(errorResponse);
};

export default errorHandlerMiddleware;
