import * as projectService from "./project.service.js";

export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(
      req.cleanedBody || req.body,
    );

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();

    res.status(200).json({
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);

    res.status(200).json({
      message: "Project retrieved successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id, ...projectData } = req.cleanedBody || req.body;
    const project = await projectService.updateProject(
      req.params.id,
      projectData,
    );

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const message = await projectService.deleteProject(req.params.id);

    res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
