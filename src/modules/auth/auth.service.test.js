import { jest } from "@jest/globals";

const genSaltMock = jest.fn();
const hashMock = jest.fn();
const compareMock = jest.fn();
const userFindOneMock = jest.fn();
const userFindByIdMock = jest.fn();
const saveMock = jest.fn();
const generateNewTokenPairMock = jest.fn();
const invalidateAllUserTokensMock = jest.fn();
const verifyRefreshTokenMock = jest.fn();

const UserMock = jest.fn(function User(data) {
  Object.assign(this, data);
  this._id = data._id || "507f1f77bcf86cd799439011";
  this.save = saveMock;
});

UserMock.findOne = userFindOneMock;
UserMock.findById = userFindByIdMock;

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    genSalt: genSaltMock,
    hash: hashMock,
    compare: compareMock,
  },
}));

jest.unstable_mockModule("../../shared/utils/logger.js", () => ({
  default: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.unstable_mockModule("../users/user.model.js", () => ({
  default: UserMock,
}));

jest.unstable_mockModule("./auth.utils.js", () => ({
  generateNewTokenPair: generateNewTokenPairMock,
  invalidateAllUserTokens: invalidateAllUserTokensMock,
  verifyRefreshToken: verifyRefreshTokenMock,
}));

const authService = await import("./auth.service.js");

beforeEach(() => {
  jest.clearAllMocks();
  genSaltMock.mockResolvedValue("salt");
  hashMock.mockResolvedValue("hashed-password");
  compareMock.mockResolvedValue(true);
  saveMock.mockResolvedValue(undefined);
  generateNewTokenPairMock.mockResolvedValue({
    accessToken: "access-token",
    refreshToken: "refresh-token",
  });
  verifyRefreshTokenMock.mockReturnValue({
    id: "507f1f77bcf86cd799439011",
  });
});

describe("auth service", () => {
  test("register hashes password and creates user", async () => {
    await expect(
      authService.register({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    ).resolves.toBe("User registered successfully");

    expect(genSaltMock).toHaveBeenCalledTimes(1);
    expect(hashMock).toHaveBeenCalledWith("password123", "salt");
    expect(saveMock).toHaveBeenCalledTimes(1);
  });

  test("login rejects unknown user", async () => {
    userFindOneMock.mockResolvedValue(null);

    await expect(
      authService.login({
        email: "missing@example.com",
        password: "password123",
      }),
    ).rejects.toMatchObject({
      status: 400,
      message: "Invalid credentials",
    });
  });

  test("login returns token pair for valid credentials", async () => {
    const user = {
      _id: "507f1f77bcf86cd799439011",
      email: "test@example.com",
      password: "hashed-password",
    };
    userFindOneMock.mockResolvedValue(user);

    await expect(
      authService.login({
        email: "test@example.com",
        password: "password123",
      }),
    ).resolves.toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      _id: "507f1f77bcf86cd799439011",
    });

    expect(compareMock).toHaveBeenCalledWith("password123", "hashed-password");
    expect(generateNewTokenPairMock).toHaveBeenCalledWith(user);
  });

  test("refreshToken verifies token and returns a new token pair", async () => {
    const user = { _id: "507f1f77bcf86cd799439011" };
    userFindByIdMock.mockResolvedValue(user);

    await expect(authService.refreshToken("refresh-token")).resolves.toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(verifyRefreshTokenMock).toHaveBeenCalledWith("refresh-token");
    expect(userFindByIdMock).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    expect(generateNewTokenPairMock).toHaveBeenCalledWith(user);
  });

  test("logout invalidates all user tokens", async () => {
    await expect(authService.logout("refresh-token")).resolves.toEqual({
      message: "User logged out successfully",
    });

    expect(verifyRefreshTokenMock).toHaveBeenCalledWith("refresh-token");
    expect(invalidateAllUserTokensMock).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
    );
  });
});
