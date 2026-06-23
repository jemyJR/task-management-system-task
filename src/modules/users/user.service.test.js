import { jest } from "@jest/globals";

const hashMock = jest.fn();
const userFindOneMock = jest.fn();
const userFindMock = jest.fn();
const userFindByIdMock = jest.fn();
const userFindByIdAndUpdateMock = jest.fn();
const userFindByIdAndDeleteMock = jest.fn();
const saveMock = jest.fn();

const UserMock = jest.fn(function User(data) {
  Object.assign(this, data);
  this._id = data._id || "507f1f77bcf86cd799439011";
  this.save = saveMock;
});

UserMock.findOne = userFindOneMock;
UserMock.find = userFindMock;
UserMock.findById = userFindByIdMock;
UserMock.findByIdAndUpdate = userFindByIdAndUpdateMock;
UserMock.findByIdAndDelete = userFindByIdAndDeleteMock;

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: hashMock,
  },
}));

jest.unstable_mockModule("../../shared/utils/logger.js", () => ({
  default: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.unstable_mockModule("./user.model.js", () => ({
  default: UserMock,
}));

const userService = await import("./user.service.js");

beforeEach(() => {
  jest.clearAllMocks();
  hashMock.mockResolvedValue("hashed-password");
  saveMock.mockResolvedValue(undefined);
});

describe("user service", () => {
  test("createUser hashes password and saves a new user", async () => {
    userFindOneMock.mockResolvedValue(null);

    const user = await userService.createUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(userFindOneMock).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(hashMock).toHaveBeenCalledWith("password123", 12);
    expect(saveMock).toHaveBeenCalledTimes(1);
    expect(user.email).toBe("test@example.com");
    expect(user.password).toBe("hashed-password");
    expect(user.role).toBe("USER");
  });

  test("createUser rejects duplicate emails", async () => {
    userFindOneMock.mockResolvedValue({ _id: "existing-id" });

    await expect(
      userService.createUser({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    ).rejects.toMatchObject({
      status: 409,
      message: "User with this email already exists",
    });
  });

  test("getAllUsers applies role filter", async () => {
    const users = [{ email: "admin@example.com", role: "ADMIN" }];
    userFindMock.mockResolvedValue(users);

    await expect(userService.getAllUsers({ role: "ADMIN" })).resolves.toBe(
      users,
    );
    expect(userFindMock).toHaveBeenCalledWith({ role: "ADMIN" });
  });

  test("updateUser hashes new password and prevents duplicate email", async () => {
    userFindByIdMock.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      email: "old@example.com",
    });
    userFindOneMock.mockResolvedValue(null);
    userFindByIdAndUpdateMock.mockResolvedValue({
      _id: "507f1f77bcf86cd799439011",
      email: "new@example.com",
    });

    await userService.updateUser("507f1f77bcf86cd799439011", {
      email: "new@example.com",
      password: "new-password",
    });

    expect(userFindOneMock).toHaveBeenCalledWith({ email: "new@example.com" });
    expect(hashMock).toHaveBeenCalledWith("new-password", 12);
    expect(userFindByIdAndUpdateMock).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      { $set: { email: "new@example.com", password: "hashed-password" } },
      { new: true, runValidators: true },
    );
  });

  test("changeUserRole rejects unsupported roles", async () => {
    await expect(
      userService.changeUserRole("507f1f77bcf86cd799439011", "MANAGER"),
    ).rejects.toMatchObject({
      status: 422,
      message: "Invalid role provided",
    });
  });

  test("deleteUser removes an existing user", async () => {
    userFindByIdMock.mockResolvedValue({ _id: "507f1f77bcf86cd799439011" });
    userFindByIdAndDeleteMock.mockResolvedValue({});

    await expect(
      userService.deleteUser("507f1f77bcf86cd799439011"),
    ).resolves.toBe("User deleted successfully");
    expect(userFindByIdAndDeleteMock).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
    );
  });
});
