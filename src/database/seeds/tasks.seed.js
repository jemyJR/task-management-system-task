import { TaskPriority, TaskStatus } from "../../constants/shared.constants.js";
import Task from "../../modules/tasks/task.model.js";

const seedTasksData = [
  {
    title: "Create Swagger docs",
    description: "Document all auth, users, projects, and tasks endpoints",
    status: TaskStatus.DONE,
    priority: TaskPriority.HIGH,
    dueDate: new Date("2026-07-01T00:00:00.000Z"),
  },
  {
    title: "Add project CRUD",
    description: "Build project model, routes, validators, controller, and service",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: new Date("2026-07-05T00:00:00.000Z"),
  },
  {
    title: "Add task filters",
    description: "Support filtering tasks by status and priority",
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date("2026-07-10T00:00:00.000Z"),
  },
];

export const seedTasks = async () => {
  const tasks = [];

  for (const taskData of seedTasksData) {
    const task = await Task.findOneAndUpdate(
      { title: taskData.title },
      { $set: taskData },
      { new: true, upsert: true, runValidators: true },
    );
    tasks.push(task);
  }

  console.log("Tasks seeded successfully");
  return tasks;
};
