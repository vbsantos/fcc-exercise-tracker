import { IUserRepository } from "../Repositories/User.Repository";
import {
  UserService,
  IUserService,
  IUserServiceResponse,
} from "./User.Service";

describe("UserService", () => {
  let userService: IUserService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepositoryMock = {
      createUser: jest.fn(),
      getUsers: jest.fn(),
      getUserByUsername: jest.fn(),
    };

    userService = new UserService(userRepositoryMock);
  });

  describe("createUser", () => {
    it("should return null when user already exists", async () => {
      const existingUser: IUserServiceResponse = {
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
      const newUser: IUserServiceResponse = {
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
      const users: IUserServiceResponse[] = [
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
      const users: IUserServiceResponse[] = [];

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
});
