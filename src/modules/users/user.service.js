import bcrypt from "bcrypt";
import { Roles } from "../../constants/shared.constants.js";
import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from "../../shared/exceptions/http.exceptions.js";
import logger from "../../shared/utils/logger.js";
import User from "./user.model.js";

export const createUser = async (userData) => {
  logger.info("Creating new user", {
    name: userData.name,
    email: userData.email,
  });
  const { name, email, password, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictException("User with this email already exists");
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: role || Roles.USER,
  });

  await user.save();
  logger.info("User created successfully", { id: user._id, email: user.email });

  return user;
};

export const getAllUsers = async (filters = {}) => {
  logger.info("Retrieving all users", filters);

  const query = {};

  if (filters.role) {
    query.role = filters.role;
  }

  const users = await User.find(query);
  logger.info(`Found ${users.length} users`);

  return users;
};

export const getUserById = async (id) => {
  logger.info("Retrieving user by ID", { id });
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  logger.info("User retrieved successfully", { id: user._id });
  return user;
};

export const getUserByEmail = async (email) => {
  logger.info("Retrieving user by email", { email });
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundException("User not found");
  }

  logger.info("User retrieved successfully", { id: user._id });
  return user;
};

export const updateUser = async (id, userData) => {
  logger.info("Updating user", { id, userData });

  Object.keys(userData).forEach((key) => {
    if (userData[key] === "") {
      delete userData[key];
    }
  });

  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (userData.email && userData.email !== user.email) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }
  }

  if (userData.password) {
    const saltRounds = 12;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: userData },
    {
      new: true,
      runValidators: true,
    },
  );

  logger.info("User updated successfully", { id: updatedUser._id });
  return updatedUser;
};

export const deleteUser = async (id) => {
  logger.info("Deleting user", { id });

  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  await User.findByIdAndDelete(id);
  logger.info("User deleted successfully", { id });

  return "User deleted successfully";
};

export const changeUserRole = async (id, newRole) => {
  logger.info("Changing user role", { id, newRole });

  if (!Object.values(Roles).includes(newRole)) {
    throw new UnprocessableEntityException("Invalid role provided");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: { role: newRole } },
    { new: true },
  );

  logger.info("User role updated successfully", {
    id: updatedUser._id,
    role: newRole,
  });
  return updatedUser;
};

export const getUsersByRole = async (role) => {
  logger.info("Retrieving users by role", { role });

  if (!Object.values(Roles).includes(role)) {
    throw new UnprocessableEntityException("Invalid role provided");
  }

  const users = await User.find({ role });
  logger.info(`Found ${users.length} users with role ${role}`);

  return users;
};
