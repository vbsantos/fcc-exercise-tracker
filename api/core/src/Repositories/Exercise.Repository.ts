import { Repository } from "./Repository";

export interface IExercise {
  id: number;
  user_id: number;
  description: string;
  duration: number;
  date: string;
}

export interface IExerciseRepository {
  createExercise(
    userId: number,
    exerciseDescription: string,
    exerciseDuration: number,
    exerciseDate: string
  ): Promise<IExercise>;
  getExercisesByUserId(userId: number): Promise<IExercise>;
}

export class ExerciseRepository
  extends Repository
  implements IExerciseRepository
{
  constructor() {
    super();
  }

  public async createExercise(
    userId: number,
    exerciseDescription: string,
    exerciseDuration: number,
    exerciseDate: string
  ): Promise<IExercise> {
    throw new Error("Method not implemented.");
  }

  public async getExercisesByUserId(userId: number): Promise<IExercise> {
    throw new Error("Method not implemented.");
  }
}
