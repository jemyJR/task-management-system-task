import { jest } from "@jest/globals";

const projectExistsMock = jest.fn();
const taskCreateMock = jest.fn();
const taskFindMock = jest.fn();
const taskFindByIdMock = jest.fn();
const taskFindByIdAndUpdateMock = jest.fn();
const taskFindByIdAndDeleteMock = jest.fn();

jest.unstable_mockModule("../../shared/utils/logger.js", () => ({
  default: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.unstable_mockModule("../projects/project.model.js", () => ({
  default: {
    exists: projectExistsMock,
  },
}));

jest.unstable_mockModule("./task.model.js", () => ({
  default: {
    create: taskCreateMock,
    find: taskFindMock,
    findById: taskFindByIdMock,
    findByIdAndUpdate: taskFindByIdAndUpdateMock,
    findByIdAndDelete: taskFindByIdAndDeleteMock,
  },
}));

const taskService = await import("./task.service.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("task service", () => {
  test("createTask creates a task when project exists", async () => {
    const taskData = {
      project: "project-id",
      title: "New Task",
      description: "Task description",
      dueDate: new Date("2026-07-01"),
    };
    const createdTask = { _id: "task-id", ...taskData };
    projectExistsMock.mockResolvedValue(true);
    taskCreateMock.mockResolvedValue(createdTask);

    await expect(taskService.createTask(taskData)).resolves.toBe(createdTask);

    expect(projectExistsMock).toHaveBeenCalledWith({ _id: "project-id" });
    expect(taskCreateMock).toHaveBeenCalledWith(taskData);
  });

  test("createTask rejects when project does not exist", async () => {
    projectExistsMock.mockResolvedValue(false);

    await expect(
      taskService.createTask({
        project: "missing-project",
        title: "New Task",
        description: "Task description",
        dueDate: new Date("2026-07-01"),
      }),
    ).rejects.toMatchObject({
      status: 404,
      message: "Project not found",
    });
  });

  test("updateTask updates a task and validates project changes", async () => {
    projectExistsMock.mockResolvedValue(true);
    taskFindByIdAndUpdateMock.mockResolvedValue({
      _id: "task-id",
      title: "Updated Task",
    });

    await expect(
      taskService.updateTask("task-id", {
        project: "project-id",
        title: "Updated Task",
      }),
    ).resolves.toEqual({
      _id: "task-id",
      title: "Updated Task",
    });

    expect(projectExistsMock).toHaveBeenCalledWith({ _id: "project-id" });
    expect(taskFindByIdAndUpdateMock).toHaveBeenCalledWith(
      "task-id",
      { $set: { project: "project-id", title: "Updated Task" } },
      { new: true, runValidators: true },
    );
  });

  test("deleteTask removes an existing task", async () => {
    taskFindByIdAndDeleteMock.mockResolvedValue({ _id: "task-id" });

    await expect(taskService.deleteTask("task-id")).resolves.toBe(
      "Task deleted successfully",
    );

    expect(taskFindByIdAndDeleteMock).toHaveBeenCalledWith("task-id");
  });
});