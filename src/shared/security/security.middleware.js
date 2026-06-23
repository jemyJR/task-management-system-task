import sanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import { DEFAULT_DEVELOPMENT } from "../../constants/shared.constants.js";
import config from "../config/config.js";
import rateLimiter from "./rateLimiter.middleware.js";
import conditionalXssMiddleware from "./xssMiddleware.js";

const securityMiddleware = (app) => {
  // Set security headers
  app.use(helmet());

  // Prevent http param pollution
  app.use(hpp());

  // Prevent XSS attacks
  app.use(conditionalXssMiddleware());

  // Rate limiting
  if (config.NODE_ENV !== DEFAULT_DEVELOPMENT) {
    app.use(rateLimiter);
  }

  // Prevent NoSQL injection
  app.use(sanitize());
};

export default securityMiddleware;
