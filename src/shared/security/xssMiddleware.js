import xss from "xss-clean";
import logger from "../utils/logger.js";

const excludedEndpoints = [
  //TODO: Add more endpoints to exclude from xss-clean middleware like
  // { path: '/questions', methods: ['PUT', 'POST'] },
];

const conditionalXssMiddleware = () => {
  const xssMiddleware = xss();

  return (req, res, next) => {
    const shouldExclude = excludedEndpoints.some((endpoint) => {
      if (!endpoint.methods.includes(req.method)) {
        return false;
      }
      // Build a regex pattern for the endpoint path
      const pattern = new RegExp(`^${endpoint.path}(\\/|$)`);
      return pattern.test(req.originalUrl);
    });

    if (shouldExclude) {
      logger.debug(`Skipping xss-clean middleware for: ${req.originalUrl}`);
      return next();
    }

    // Override req.query with a writable property
    Object.defineProperty(req, "query", {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true,
    });
    return xssMiddleware(req, res, next);
  };
};

export default conditionalXssMiddleware;
