import express from "express";
import { PERMISSIONS } from "../../constants/permissions.constants.js";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import { requirePermission } from "../../shared/middleware/permission.middleware.js";
import * as projectController from "./project.controller.js";
import {
  createProjectValidator,
  deleteProjectValidator,
  getAllProjectsValidator,
  getProjectValidator,
  updateProjectValidator,
} from "./project.validators.js";

const projectRouter = express.Router();

projectRouter.use(authMiddleware);

projectRouter.get(
  "/",
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getAllProjectsValidator,
  projectController.getAllProjects,
);

projectRouter.get(
  "/:id",
  requirePermission(PERMISSIONS.VIEW_PROJECTS),
  getProjectValidator,
  projectController.getProjectById,
);

projectRouter.post(
  "/",
  requirePermission(PERMISSIONS.ADD_PROJECT),
  createProjectValidator,
  projectController.createProject,
);

projectRouter.patch(
  "/:id",
  requirePermission(PERMISSIONS.EDIT_PROJECT),
  updateProjectValidator,
  projectController.updateProject,
);

projectRouter.delete(
  "/:id",
  requirePermission(PERMISSIONS.DELETE_PROJECT),
  deleteProjectValidator,
  projectController.deleteProject,
);

export default projectRouter;
