import { body, param, query } from "express-validator";
import { TaskPriority, TaskStatus } from "../../constants/shared.constants.js";
import { validate } from "../../shared/utils/validators.js";

export const createTaskValidator = [
  body("project")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid project ID format"),
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
    .isIn(Object.values(TaskStatus))
    .withMessage(
      `Status must be one of: ${Object.values(TaskStatus).join(", ")}`,
    ),
  body("priority")
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage(
      `Priority must be one of: ${Object.values(TaskPriority).join(", ")}`,
    ),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
  validate,
];

export const getAllTasksValidator = [
  query("status")
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage(
      `Status must be one of: ${Object.values(TaskStatus).join(", ")}`,
    ),
  query("priority")
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage(
      `Priority must be one of: ${Object.values(TaskPriority).join(", ")}`,
    ),
  query("project")
    .optional()
    .isMongoId()
    .withMessage("Invalid project ID format"),
  validate,
];

export const getTaskValidator = [
  param("id").isMongoId().withMessage("Invalid task ID format"),
  validate,
];

export const updateTaskValidator = [
  param("id").isMongoId().withMessage("Invalid task ID format"),
  body("project")
    .optional()
    .isMongoId()
    .withMessage("Invalid project ID format"),
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
    .isIn(Object.values(TaskStatus))
    .withMessage(
      `Status must be one of: ${Object.values(TaskStatus).join(", ")}`,
    ),
  body("priority")
    .optional()
    .isIn(Object.values(TaskPriority))
    .withMessage(
      `Priority must be one of: ${Object.values(TaskPriority).join(", ")}`,
    ),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),
  validate,
];

export const deleteTaskValidator = [
  param("id").isMongoId().withMessage("Invalid task ID format"),
  validate,
];
