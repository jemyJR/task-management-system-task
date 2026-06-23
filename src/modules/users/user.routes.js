import express from "express";
import { PERMISSIONS } from "../../constants/permissions.constants.js";
import authMiddleware from "../../shared/middleware/auth.middleware.js";
import { requirePermission } from "../../shared/middleware/permission.middleware.js";
import * as userController from "./user.controller.js";
import {
  changeUserRoleValidator,
  createUserValidator,
  deleteUserValidator,
  getAllUsersValidator,
  getUserValidator,
  getUsersByRoleValidator,
  updateUserValidator,
} from "./user.validators.js";

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get(
  "/",
  requirePermission(PERMISSIONS.VIEW_USERS),
  getAllUsersValidator,
  userController.getAllUsers
);

userRouter.get(
  "/role/:role",
  requirePermission(PERMISSIONS.VIEW_USERS),
  getUsersByRoleValidator,
  userController.getUsersByRole
);

userRouter.get(
  "/:id",
  requirePermission(PERMISSIONS.VIEW_USERS),
  getUserValidator,
  userController.getUserById
);

userRouter.post(
  "/",
  requirePermission(PERMISSIONS.ADD_USER),
  createUserValidator,
  userController.createUser
);

userRouter.patch(
  "/:id",
  requirePermission(PERMISSIONS.EDIT_USER),
  updateUserValidator,
  userController.updateUser
);

userRouter.patch(
  "/:id/role",
  requirePermission(PERMISSIONS.CHANGE_USER_ROLE),
  changeUserRoleValidator,
  userController.changeUserRole
);

userRouter.delete(
  "/:id",
  requirePermission(PERMISSIONS.DELETE_USER),
  deleteUserValidator,
  userController.deleteUser
);

export default userRouter;
