import { matchedData, validationResult } from "express-validator";
import { BadRequestException } from "../exceptions/http.exceptions.js";

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = {};
    result.array().forEach((err) => {
      const field = err.param ?? err.path ?? "field";
      if (!details[field]) {
        details[field] = err.msg;
      }
    });
    return next(new BadRequestException("Validation failed", { details }));
  }

  req.cleanedBody = matchedData(req, { locations: ["params", "body"] });
  next();
};

export default validate;
