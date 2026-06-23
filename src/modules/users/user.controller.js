import * as userService from "./user.service.js";

export const createUser = async (req, res, next) => {
  try {
    const userData = req.cleanedBody || req.body;
    const user = await userService.createUser(userData);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filters = role ? { role } : {};

    const users = await userService.getAllUsers(filters);

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.cleanedBody || req.body;

    const user = await userService.updateUser(id, userData);

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await userService.deleteUser(id);

    res.status(200).json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.cleanedBody || req.body;

    const user = await userService.changeUserRole(id, role);

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const users = await userService.getUsersByRole(role);

    res.status(200).json({
      message: `Users retrieved successfully for role ${role}`,
      users,
    });
  } catch (error) {
    next(error);
  }
};
