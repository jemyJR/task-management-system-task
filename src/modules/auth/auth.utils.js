import jwt from "jsonwebtoken";
import config from "../../shared/config/config.js";
import {
  BadRequestException,
  ForbiddenException,
} from "../../shared/exceptions/http.exceptions.js";
import logger from "../../shared/utils/logger.js";
import User from "../users/user.model.js";

export const generateAccessToken = (user) => {
  logger.debug("Generating access token for user", user._id);
  return jwt.sign(
    {
      id: user._id,
      phone: user.phone,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (user) => {
  logger.debug("Generating refresh token for user", user._id);
  return jwt.sign(
    {
      id: user._id,
      phone: user.phone,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRY }
  );
};

export const verifyRefreshToken = (token) => {
  logger.debug("Verifying refresh token");

  try {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ForbiddenException("Refresh token has expired");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new ForbiddenException("Invalid refresh token");
    }
    throw err;
  }
};

export const generateNewTokenPair = async (user) => {
  user.tokenVersion += 1;
  await user.save();

  logger.info(
    `Generated new token pair for user ${user._id}, tokenVersion: ${user.tokenVersion}`
  );

  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};
export const generateNewTokenPairForAdmin = async (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

export const invalidateAllUserTokens = async (userId) => {
  logger.debug("Invalidating all tokens for user", userId);
  const user = await User.findById(userId);
  if (!user) {
    throw new BadRequestException("User not found");
  }

  user.tokenVersion += 1;
  await user.save();

  logger.info(
    `Invalidated all tokens for user ${userId}, new tokenVersion: ${user.tokenVersion}`
  );
  return user;
};
