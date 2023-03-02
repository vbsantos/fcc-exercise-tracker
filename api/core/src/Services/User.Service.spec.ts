import { IUser, IUserRepository } from "../Repositories/User.Repository";
import {
  UserService,
  IUserService,
} from "./User.Service";

describe("UserService", () => {
  let userService: IUserService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      createUser: jest.fn(),
      getUsers: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserById: jest.fn(),
    };

    userService = new UserService(userRepositoryMock);
  });

  describe("createUser", () => {
    it("should return null when user already exists", async () => {
      const existingUser: IUser = {
        _id: 1,
        username: "testUser",
      };
      userRepositoryMock.getUserByUsername.mockResolvedValue(existingUser);

      const result = await userService.createUser(existingUser.username);

      expect(userRepositoryMock.getUserByUsername).toHaveBeenCalledWith(
        existingUser.username
      );
      expect(userRepositoryMock.createUser).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should create user and return _id and username", async () => {
      const newUser: IUser = {
        _id: 2,
        username: "newUser",
      };
      userRepositoryMock.getUserByUsername.mockResolvedValue(null);
      userRepositoryMock.createUser.mockResolvedValue(newUser);

      const result = await userService.createUser(newUser.username);

      expect(userRepositoryMock.getUserByUsername).toHaveBeenCalledWith(
        newUser.username
      );
      expect(userRepositoryMock.createUser).toHaveBeenCalledWith(
        newUser.username
      );
      expect(result).toEqual(newUser);
    });

    it("should return null when user creation fails", async () => {
      userRepositoryMock.getUserByUsername.mockResolvedValue(null);
      userRepositoryMock.createUser.mockResolvedValue(null);

      const result = await userService.createUser("nonExistingUser");

      expect(userRepositoryMock.getUserByUsername).toHaveBeenCalledWith(
        "nonExistingUser"
      );
      expect(userRepositoryMock.createUser).toHaveBeenCalledWith(
        "nonExistingUser"
      );
      expect(result).toBeNull();
    });
  });

  describe("getUsers", () => {
    it("should return users from the repository", async () => {
      const users: IUser[] = [
        { _id: 1, username: "user1" },
        { _id: 2, username: "user2" },
        { _id: 3, username: "user3" },
      ];

      userRepositoryMock.getUsers.mockResolvedValue(users);

      const result = await userService.getUsers();

      expect(userRepositoryMock.getUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it("should return empty array from the repository if it have no users", async () => {
      const users: IUser[] = [];

      userRepositoryMock.getUsers.mockResolvedValue(users);

      const result = await userService.getUsers();

      expect(userRepositoryMock.getUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it("should return empty array if user index fails", async () => {
      userRepositoryMock.getUsers.mockResolvedValue(null);

      const result = await userService.getUsers();

      expect(userRepositoryMock.getUsers).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("getUserById", () => {
    it("should return _id and username from the respository", async () => {
      const user: IUser = {
        _id: 4,
        username: "user4",
      };

      userRepositoryMock.getUserById.mockResolvedValue(user);

      const result = await userService.getUserById(user._id);

      expect(userRepositoryMock.getUserById).toHaveBeenCalledWith(user._id);
      expect(result).toEqual(user);
    });
    it("should return null from the repository if not found", async () => {
      userRepositoryMock.getUserById.mockResolvedValue(null);

      const result = await userService.getUserById(-1);

      expect(userRepositoryMock.getUserById).toHaveBeenCalledWith(-1);
      expect(result).toEqual(null);
    });
  });
});
