import winston from "winston";
import "winston-mongodb";
import { MONGO_URL } from "../../constants/db.constants.js";
import { LOG_LEVEL_IN_DATABASE } from "../../constants/shared.constants.js";
import config from "../config/config.js";

const { combine, timestamp, printf, errors, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} - ${level}: ${stack || message}`;
});

const transports = [];

transports.push(
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      customFormat
    ),
  })
);

transports.push(
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      customFormat
    ),
  }),
  new winston.transports.File({
    filename: "logs/combined.log",
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      customFormat
    ),
  })
);

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  transports,
  exitOnError: false,
});

logger.add(
  new winston.transports.MongoDB({
    db: MONGO_URL,
    collection: "app_logs",
    level: LOG_LEVEL_IN_DATABASE,
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      customFormat
    ),
  })
);

export default logger;
