import Task from "../../modules/tasks/task.model.js";

export const migrate = async () => {
  await Task.syncIndexes();
  console.log("Task indexes synced successfully");
};
