import {
  IExercise,
  IExerciseBase,
  IExerciseRepository,
  ILogFilters,
} from "../Repositories/Exercise.Repository";
import { IUser, IUserRepository } from "../Repositories/User.Repository";

export interface IExerciseServiceResponse extends IExerciseBase {
  _id: number;
  username: string;
}

export interface IExerciseLogServiceResponse {
  _id: number;
  username: string;
  count: number;
  log: IExerciseBase[];
}

export interface IExerciseService {
  createExercise(
    userId: number,
    exerciseDescription: string,
    exerciseDuration: number,
    exerciseDate: string
  ): Promise<IExerciseServiceResponse | null>;
  getExercisesByUserId(
    userId: number,
    filters: ILogFilters
  ): Promise<IExerciseLogServiceResponse | null>;
}

export class ExerciseService implements IExerciseService {
  private exerciseRepository: IExerciseRepository;
  private userRepository: IUserRepository;

  constructor(
    exerciseRepository: IExerciseRepository,
    userRepository: IUserRepository
  ) {
    this.exerciseRepository = exerciseRepository;
    this.userRepository = userRepository;
    this.createExercise = this.createExercise.bind(this);
    this.getExercisesByUserId = this.getExercisesByUserId.bind(this);
  }

  public async createExercise(
    userId: number,
    exerciseDescription: string,
    exerciseDuration: number,
    exerciseDate: string
  ): Promise<IExerciseServiceResponse | null> {
    const exerciseRepositoryResponseAsync: Promise<IExercise> =
      this.exerciseRepository.createExercise(
        userId,
        exerciseDescription,
        exerciseDuration,
        exerciseDate
      );
    const userRepositoryResponseAsync: Promise<IUser | null> =
      this.userRepository.getUserById(userId);

    const [exerciseRepositoryResponse, userRepositoryResponse] =
      await Promise.all([
        exerciseRepositoryResponseAsync,
        userRepositoryResponseAsync,
      ]);
    if (!userRepositoryResponse) {
      return null;
    }

    const response: IExerciseServiceResponse = {
      _id: userRepositoryResponse._id,
      username: userRepositoryResponse.username,
      description: exerciseRepositoryResponse.description,
      date: exerciseRepositoryResponse.date,
      duration: exerciseRepositoryResponse.duration,
    };

    return response;
  }

  public async getExercisesByUserId(
    userId: number,
    filters: ILogFilters
  ): Promise<IExerciseLogServiceResponse | null> {
    const exerciseRepositoryResponseAsync: Promise<IExerciseBase[]> =
      this.exerciseRepository.getExercisesByUserId(userId, filters);
    const userRepositoryResponseAsync: Promise<IUser | null> =
      this.userRepository.getUserById(userId);

    const [exerciseRepositoryResponse, userRepositoryResponse] =
      await Promise.all([
        exerciseRepositoryResponseAsync,
        userRepositoryResponseAsync,
      ]);

    if (!exerciseRepositoryResponse || !userRepositoryResponse) {
      return null;
    }

    const serviceResponse: IExerciseLogServiceResponse = {
      _id: userRepositoryResponse._id,
      username: userRepositoryResponse.username,
      count: exerciseRepositoryResponse.length,
      log: exerciseRepositoryResponse,
    };

    return serviceResponse;
  }
}
