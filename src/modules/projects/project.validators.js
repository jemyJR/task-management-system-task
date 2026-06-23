import { body, param } from "express-validator";
import { ProjectStatus } from "../../constants/shared.constants.js";
import { validate } from "../../shared/utils/validators.js";

export const createProjectValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Description must be between 2 and 1000 characters"),
  body("status")
    .optional()
    .isIn(Object.values(ProjectStatus))
    .withMessage(
      `Status must be one of: ${Object.values(ProjectStatus).join(", ")}`,
    ),
  validate,
];

export const getProjectValidator = [
  param("id").isMongoId().withMessage("Invalid project ID format"),
  validate,
];

export const updateProjectValidator = [
  param("id").isMongoId().withMessage("Invalid project ID format"),
  body("title")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("description")
    .optional()
    .isLength({ min: 2, max: 1000 })
    .withMessage("Description must be between 2 and 1000 characters"),
  body("status")
    .optional()
    .isIn(Object.values(ProjectStatus))
    .withMessage(
      `Status must be one of: ${Object.values(ProjectStatus).join(", ")}`,
    ),
  validate,
];

export const deleteProjectValidator = [
  param("id").isMongoId().withMessage("Invalid project ID format"),
  validate,
];
