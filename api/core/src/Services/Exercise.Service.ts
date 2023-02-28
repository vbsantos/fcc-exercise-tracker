import {
  IExerciseRepository,
} from "../Repositories/Exercise.Repository";

interface IExerciseBase {
  date: string;
  description: string;
  duration: number;
}

export interface IExerciseServiceResponse extends IExerciseBase {
  _id: number;
  username: string;
}

export interface IExerciseLogServiceResponse {
  username: string;
  count: number;
  _id: number;
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
    userId: number
  ): Promise<IExerciseLogServiceResponse | null>;
}

export class ExerciseService implements IExerciseService {
  private exerciseRepository: IExerciseRepository;

  constructor(exerciseRepository: IExerciseRepository) {
    this.exerciseRepository = exerciseRepository;
    this.createExercise = this.createExercise.bind(this);
    this.getExercisesByUserId = this.getExercisesByUserId.bind(this);
  }

  public async createExercise(
    userId: number,
    exerciseDescription: string,
    exerciseDuration: number,
    exerciseDate: string
  ): Promise<IExerciseServiceResponse | null> {
    throw new Error("Method not implemented.");
  }

  public async getExercisesByUserId(
    userId: number
  ): Promise<IExerciseLogServiceResponse | null> {
    throw new Error("Method not implemented.");
  }
}
