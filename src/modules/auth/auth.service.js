import bcrypt from "bcrypt";
import {
  BadRequestException,
  NotFoundException,
} from "../../shared/exceptions/http.exceptions.js";
import logger from "../../shared/utils/logger.js";
import User from "../users/user.model.js";
import {
  generateNewTokenPair,
  invalidateAllUserTokens,
  verifyRefreshToken,
} from "./auth.utils.js";

export const register = async (userData) => {
  logger.info("Registering user", userData);
  const { name, email, password } = userData;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  await user.save();
  logger.info("User created Successfully", user);
  return "User registered successfully";
};

export const login = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestException("Invalid credentials");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestException("Invalid credentials");
  }

  const tokens = await generateNewTokenPair(user);

  logger.info(
    `User ${user._id} with email ${user.email} logged in successfully`,
  );

  return {
    ...tokens,
    _id: user._id,
  };
};

export const refreshToken = async (refreshToken) => {
  logger.debug("Refreshing access token using refresh token");
  const decodedToken = verifyRefreshToken(refreshToken);

  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new NotFoundException("User not found");
  }
  const tokens = await generateNewTokenPair(user);

  logger.info(
    `Access token refreshed successfully for user with ID: ${user._id}`,
  );
  return {
    ...tokens,
  };
};

export const logout = async (refreshToken) => {
  logger.debug("Logging out user by invalidating all tokens");
  const decoded = verifyRefreshToken(refreshToken);
  const userId = decoded.id;
  await invalidateAllUserTokens(userId);

  logger.info(`User ${userId} logged out, all tokens invalidated`);

  return { message: "User logged out successfully" };
};
