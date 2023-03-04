import "jest";
import "reflect-metadata";

import {
  ExerciseService,
  IExerciseService,
  IExerciseServiceResponse,
} from "../../src/Services/Exercise.Service";
import {
  IExerciseBase,
  IExerciseRepository,
  ILogFilters,
} from "../../src/Repositories/Exercise.Repository";
import { IUser, IUserRepository } from "../../src/Repositories/User.Repository";
import { IUserService, UserService } from "../../src/Services/User.Service";

describe("ExerciseService", () => {
  let userService: IUserService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let exerciseService: IExerciseService;
  let exerciseRepositoryMock: jest.Mocked<IExerciseRepository>;

  beforeEach(() => {
    exerciseRepositoryMock = {
      createExercise: jest.fn(),
      getExercisesByUserId: jest.fn(),
    };

    userRepositoryMock = {
      createUser: jest.fn(),
      getUsers: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserById: jest.fn(),
    };

    userService = new UserService(userRepositoryMock);
    exerciseService = new ExerciseService(
      exerciseRepositoryMock,
      userRepositoryMock
    );
  });

  describe("createExercise", () => {
    it("should return null if the userRepository response is null", async () => {
      userRepositoryMock.getUserById.mockResolvedValue(null);

      const result = await exerciseService.createExercise(
        1,
        "description",
        10,
        new Date("2023-03-02")
      );

      expect(result).toBeNull();
    });

    it("should create exercise if both the repositories response are not null", async () => {
      exerciseRepositoryMock.createExercise.mockResolvedValue({
        _id: 1,
        user_id: 1,
        description: "description",
        duration: 10,
        date: new Date("2023-03-02"),
      });
      userRepositoryMock.getUserById.mockResolvedValue({
        _id: 2,
        username: "user",
      });

      const expectedResult: IExerciseServiceResponse = {
        _id: 2,
        username: "user",
        description: "description",
        duration: 10,
        date: new Date("2023-03-02"),
      };

      const result = await exerciseService.createExercise(
        1,
        "description",
        10,
        new Date("2023-03-02")
      );

      expect(result).toEqual(expectedResult);
    });
  });

  describe("getExercisesByUserId", () => {
    let exerciseRepositoryMock: {
      getExercisesByUserId: jest.Mock<
        Promise<IExerciseBase[] | null>,
        [number, ILogFilters]
      >;
    };
    let userRepositoryMock: {
      getUserById: jest.Mock<Promise<IUser | null>, [number]>;
    };
    let exerciseService: ExerciseService;

    beforeEach(() => {
      exerciseRepositoryMock = {
        getExercisesByUserId: jest.fn(),
      };
      userRepositoryMock = {
        getUserById: jest.fn(),
      };
      exerciseService = new ExerciseService(
        exerciseRepositoryMock as any,
        userRepositoryMock as any
      );
    });

    it("should return null if user does not exist", async () => {
      const userId = 1234;
      userRepositoryMock.getUserById.mockResolvedValueOnce(null);

      const result = await exerciseService.getExercisesByUserId(userId, {});

      expect(userRepositoryMock.getUserById).toHaveBeenCalledWith(userId);
      expect(exerciseRepositoryMock.getExercisesByUserId).toHaveBeenCalledWith(
        userId,
        {}
      );
      expect(result).toBeNull();
    });

    it("should return null if no exercises are found", async () => {
      const userId = 1234;
      const filters = {};
      const user = { _id: userId, username: "testUser" };
      userRepositoryMock.getUserById.mockResolvedValueOnce(user);
      exerciseRepositoryMock.getExercisesByUserId.mockResolvedValueOnce(null);

      const result = await exerciseService.getExercisesByUserId(
        userId,
        filters
      );

      expect(userRepositoryMock.getUserById).toHaveBeenCalledWith(userId);
      expect(exerciseRepositoryMock.getExercisesByUserId).toHaveBeenCalledWith(
        userId,
        filters
      );
      expect(result).toBeNull();
    });

    it("should return the expected result when user and exercises are found", async () => {
      const userId = 1234;
      const filters = {};
      const user = { _id: userId, username: "testUser" };
      const exercises = [
        {
          description: "exercise1",
          duration: 30,
          date: new Date("2022-03-01"),
        },
        {
          description: "exercise2",
          duration: 45,
          date: new Date("2022-03-02"),
        },
      ];
      userRepositoryMock.getUserById.mockResolvedValueOnce(user);
      exerciseRepositoryMock.getExercisesByUserId.mockResolvedValueOnce(
        exercises
      );

      const result = await exerciseService.getExercisesByUserId(
        userId,
        filters
      );

      expect(userRepositoryMock.getUserById).toHaveBeenCalledWith(userId);
      expect(exerciseRepositoryMock.getExercisesByUserId).toHaveBeenCalledWith(
        userId,
        filters
      );
      expect(result).toEqual({
        _id: user._id,
        username: user.username,
        count: exercises.length,
        log: exercises,
      });
    });
  });
});
