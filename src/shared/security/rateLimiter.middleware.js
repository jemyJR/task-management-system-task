import rateLimit from "express-rate-limit";
import { TooManyRequestsException } from "../exceptions/http.exceptions.js";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => {
    next(
      new TooManyRequestsException(
        "Too many requests from this IP, please try again after 15 minutes"
      )
    );
  },
});

export default rateLimiter;
