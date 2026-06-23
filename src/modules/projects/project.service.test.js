import { jest } from "@jest/globals";

const projectCreateMock = jest.fn();
const projectFindMock = jest.fn();
const projectFindByIdMock = jest.fn();
const projectFindByIdAndUpdateMock = jest.fn();
const projectFindByIdAndDeleteMock = jest.fn();
const taskDeleteManyMock = jest.fn();

jest.unstable_mockModule("../../shared/utils/logger.js", () => ({
  default: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.unstable_mockModule("./project.model.js", () => ({
  default: {
    create: projectCreateMock,
    find: projectFindMock,
    findById: projectFindByIdMock,
    findByIdAndUpdate: projectFindByIdAndUpdateMock,
    findByIdAndDelete: projectFindByIdAndDeleteMock,
  },
}));

jest.unstable_mockModule("../tasks/task.model.js", () => ({
  default: {
    deleteMany: taskDeleteManyMock,
  },
}));

const projectService = await import("./project.service.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("project service", () => {
  test("createProject creates and returns a project", async () => {
    const projectData = {
      title: "New Project",
      description: "Project description",
    };
    const createdProject = { _id: "project-id", ...projectData };
    projectCreateMock.mockResolvedValue(createdProject);

    await expect(projectService.createProject(projectData)).resolves.toBe(
      createdProject,
    );
    expect(projectCreateMock).toHaveBeenCalledWith(projectData);
  });

  test("getProjectById throws when project is missing", async () => {
    projectFindByIdMock.mockResolvedValue(null);

    await expect(
      projectService.getProjectById("project-id"),
    ).rejects.toMatchObject({
      status: 404,
      message: "Project not found",
    });
  });

  test("deleteProject deletes the project and its tasks", async () => {
    projectFindByIdAndDeleteMock.mockResolvedValue({ _id: "project-id" });
    taskDeleteManyMock.mockResolvedValue({ deletedCount: 3 });

    await expect(projectService.deleteProject("project-id")).resolves.toBe(
      "Project and its associated tasks deleted successfully",
    );

    expect(projectFindByIdAndDeleteMock).toHaveBeenCalledWith("project-id");
    expect(taskDeleteManyMock).toHaveBeenCalledWith({ project: "project-id" });
  });
});