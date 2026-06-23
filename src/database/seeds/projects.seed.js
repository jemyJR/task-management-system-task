import { ProjectStatus } from "../../constants/shared.constants.js";
import Project from "../../modules/projects/project.model.js";

export const seedProjects = async (tasks = []) => {
  await Project.findOneAndUpdate(
    { title: "Task Management API" },
    {
      $set: {
        title: "Task Management API",
        description: "Backend project for managing users, projects, and tasks",
        status: ProjectStatus.IN_PROGRESS,
        tasks: tasks.map((task) => task._id),
      },
    },
    { new: true, upsert: true, runValidators: true },
  );

  console.log("Projects seeded successfully");
};
