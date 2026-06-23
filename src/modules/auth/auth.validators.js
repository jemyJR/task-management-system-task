import { body } from "express-validator";
import { BadRequestException } from "../../shared/exceptions/http.exceptions.js";
import { validate } from "../../shared/utils/validators.js";
import User from "../users/user.model.js";

export const registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestException("Email already exists");
      }
    }),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  validate,
];

export const loginValidator = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  validate,
];

export const refreshTokenValidator = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
  validate,
];
