import { NotFoundException } from "../../shared/exceptions/http.exceptions.js";
import logger from "../../shared/utils/logger.js";
import Project from "./project.model.js";

export const createProject = async (projectData) => {
  logger.info("Creating new project", { title: projectData.title });
  const project = await Project.create(projectData);
  logger.info("Project created successfully", { id: project._id });
  return project;
};

export const getAllProjects = async () => {
  logger.info("Retrieving projects");
  return Project.find();
};

export const getProjectById = async (id) => {
  logger.info("Retrieving project by ID", { id });
  const project = await Project.findById(id);

  if (!project) {
    throw new NotFoundException("Project not found");
  }

  return project;
};

export const updateProject = async (id, projectData) => {
  logger.info("Updating project", { id });

  const project = await Project.findByIdAndUpdate(
    id,
    { $set: projectData },
    { new: true, runValidators: true },
  );

  if (!project) {
    throw new NotFoundException("Project not found");
  }

  return project;
};

export const deleteProject = async (id) => {
  logger.info("Deleting project", { id });
  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    throw new NotFoundException("Project not found");
  }

  return "Project deleted successfully";
};
