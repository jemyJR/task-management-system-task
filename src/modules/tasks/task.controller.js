import * as taskService from "./task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.cleanedBody || req.body);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, project } = req.query;
    const tasks = await taskService.getAllTasks({ status, priority, project });

    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id);

    res.status(200).json({
      message: "Task retrieved successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id, ...taskData } = req.cleanedBody || req.body;
    const task = await taskService.updateTask(req.params.id, taskData);

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const message = await taskService.deleteTask(req.params.id);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
