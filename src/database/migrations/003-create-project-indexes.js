import Project from "../../modules/projects/project.model.js";

export const migrate = async () => {
  await Project.syncIndexes();
  console.log("Project indexes synced successfully");
};
