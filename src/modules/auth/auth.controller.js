import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { ...userData } = req.cleanedBody;
    const message = await authService.register(userData);
    res.status(201).json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { ...userData } = req.cleanedBody;
    const result = await authService.login(userData);
    res.status(201).json({
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req.cleanedBody.refreshToken;
    const tokens = await authService.refreshToken(refreshToken);
    res.status(201).json({
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req.cleanedBody.refreshToken;
    const message = await authService.logout(refreshToken);
    res.status(201).json({
      message,
    });
  } catch (error) {
    next(error);
  }
};
