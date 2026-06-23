import { NotFoundException } from "../../shared/exceptions/http.exceptions.js";
import logger from "../../shared/utils/logger.js";
import Task from "./task.model.js";

export const createTask = async (taskData) => {
  logger.info("Creating new task", { title: taskData.title });
  const task = await Task.create(taskData);
  logger.info("Task created successfully", { id: task._id });
  return task;
};

export const getAllTasks = async (filters = {}) => {
  logger.info("Retrieving tasks", filters);

  const query = {};
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.priority) {
    query.priority = filters.priority;
  }

  return Task.find(query);
};

export const getTaskById = async (id) => {
  logger.info("Retrieving task by ID", { id });
  const task = await Task.findById(id);

  if (!task) {
    throw new NotFoundException("Task not found");
  }

  return task;
};

export const updateTask = async (id, taskData) => {
  logger.info("Updating task", { id });

  const task = await Task.findByIdAndUpdate(
    id,
    { $set: taskData },
    { new: true, runValidators: true },
  );

  if (!task) {
    throw new NotFoundException("Task not found");
  }

  return task;
};

export const deleteTask = async (id) => {
  logger.info("Deleting task", { id });
  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    throw new NotFoundException("Task not found");
  }

  return "Task deleted successfully";
};
