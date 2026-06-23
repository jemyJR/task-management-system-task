import { body, param, query } from "express-validator";
import { Roles } from "../../constants/shared.constants.js";
import { validate } from "../../shared/utils/validators.js";

export const createUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(Object.values(Roles))
    .withMessage(`Role must be one of: ${Object.values(Roles).join(", ")}`),

  validate,
];

export const getAllUsersValidator = [
  query("role")
    .optional()
    .isIn(Object.values(Roles))
    .withMessage(`Role must be one of: ${Object.values(Roles).join(", ")}`),

  validate,
];

export const getUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID format"),

  validate,
];

export const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID format"),

  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .optional()
    .isIn(Object.values(Roles))
    .withMessage(`Role must be one of: ${Object.values(Roles).join(", ")}`),

  validate,
];

export const changeUserRoleValidator = [
  param("id").isMongoId().withMessage("Invalid user ID format"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(Roles))
    .withMessage(`Role must be one of: ${Object.values(Roles).join(", ")}`),

  validate,
];

export const deleteUserValidator = [
  param("id").isMongoId().withMessage("Invalid user ID format"),

  validate,
];

export const getUsersByRoleValidator = [
  param("role")
    .isIn(Object.values(Roles))
    .withMessage(`Role must be one of: ${Object.values(Roles).join(", ")}`),

  validate,
];
