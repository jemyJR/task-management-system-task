import logger from "../utils/logger.js";

const simpleLoggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  logger.info(`→ ${method} ${originalUrl}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`← ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};

export default simpleLoggerMiddleware;
