import { ProjectStatus } from "../../constants/shared.constants.js";
import Project from "../../modules/projects/project.model.js";

export const seedProjects = async () => {
  const project = await Project.findOneAndUpdate(
    { title: "Task Management API" },
    {
      $set: {
        title: "Task Management API",
        description: "Backend project for managing users, projects, and tasks",
        status: ProjectStatus.IN_PROGRESS,
      },
    },
    { new: true, upsert: true, runValidators: true },
  );

  console.log("Projects seeded successfully");
  return project;
};
