import express from "express";
import { PERMISSIONS } from "../../constants/permissions.constants.js";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import { requirePermission } from "../../shared/middleware/permission.middleware.js";
import * as taskController from "./task.controller.js";
import {
  createTaskValidator,
  deleteTaskValidator,
  getTaskValidator,
  updateTaskValidator,
} from "./task.validators.js";

const taskRouter = express.Router();

taskRouter.use(authMiddleware);

taskRouter.get(
  "/",
  requirePermission(PERMISSIONS.VIEW_TASKS),
  taskController.getAllTasks,
);

taskRouter.get(
  "/:id",
  requirePermission(PERMISSIONS.VIEW_TASKS),
  getTaskValidator,
  taskController.getTaskById,
);

taskRouter.post(
  "/",
  requirePermission(PERMISSIONS.ADD_TASK),
  createTaskValidator,
  taskController.createTask,
);

taskRouter.patch(
  "/:id",
  requirePermission(PERMISSIONS.EDIT_TASK),
  updateTaskValidator,
  taskController.updateTask,
);

taskRouter.delete(
  "/:id",
  requirePermission(PERMISSIONS.DELETE_TASK),
  deleteTaskValidator,
  taskController.deleteTask,
);

export default taskRouter;
