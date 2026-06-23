import { NotFoundException } from "../../shared/exceptions/http.exceptions.js";
import logger from "../../shared/utils/logger.js";
import Project from "../projects/project.model.js"; // 👈 استدعاء موديل البروجكت
import Task from "./task.model.js";

export const createTask = async (taskData) => {
  logger.info("Creating new task", { title: taskData.title });

  const projectExists = await Project.exists({ _id: taskData.project });
  if (!projectExists) {
    throw new NotFoundException("Project not found");
  }

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
  if (filters.project) {
    query.project = filters.project;
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

  if (taskData.project) {
    const projectExists = await Project.exists({ _id: taskData.project });
    if (!projectExists) {
      throw new NotFoundException("Project not found");
    }
  }

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
