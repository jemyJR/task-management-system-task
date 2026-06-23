import express from "express";
import * as authController from "./auth.controller.js";
import {
  loginValidator,
  refreshTokenValidator,
  registerValidator,
} from "./auth.validators.js";

const authRouter = express.Router();

authRouter.post("/register", registerValidator, authController.register);

authRouter.post("/login", loginValidator, authController.login);

authRouter.post("/logout", refreshTokenValidator, authController.logout);

authRouter.post("/refresh", refreshTokenValidator, authController.refreshToken);

export default authRouter;
