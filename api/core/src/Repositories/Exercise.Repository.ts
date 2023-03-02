import { Repository } from "./Repository";

export interface IExercise {
  id: number;
export interface IExerciseBase {
  description: string;
  duration: number;
  date: string;
}

export interface IExercise extends IExerciseBase {
  _id: number;
  user_id: number;
}

export interface ILogFilters {
  from?: string | undefined;
  to?: string | undefined;
  limit?: number | undefined;
}

export interface IExerciseRepository {
  createExercise(
    userId: number,
    exerciseDescription: string,
    exerciseDuration: number,
    exerciseDate: string
  ): Promise<IExercise>;
  getExercisesByUserId(
    userId: number,
    filters: ILogFilters
  ): Promise<IExerciseBase[]>;
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
    const connection = await this.pool.getConnection();

    try {
      const [result]: any = await connection.query(
        "INSERT INTO exercise_tracker_exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)",
        [userId, exerciseDescription, exerciseDuration, exerciseDate]
      );
    throw new Error("Method not implemented.");
  }

      const repositoryResponse: IExercise = {
        _id: result.insertId,
        user_id: userId,
        description: exerciseDescription,
        duration: exerciseDuration,
        date: exerciseDate,
      };
  public async getExercisesByUserId(userId: number): Promise<IExercise> {
    throw new Error("Method not implemented.");

      return repositoryResponse;
    } finally {
      connection.release();
    }
  }

  public async getExercisesByUserId(
    userId: number,
    filters: ILogFilters
  ): Promise<IExerciseBase[]> {
    const connection = await this.pool.getConnection();

    try {
      let query =
        "SELECT description, duration, date FROM exercise_tracker_exercises WHERE user_id = ?";

      const queryParams: any[] = [userId];

      if (filters?.from) {
        query += " AND date >= ?";
        queryParams.push(filters.from);
      }

      if (filters?.to) {
        query += " AND date <= ?";
        queryParams.push(filters.to);
      }

      if (filters?.limit) {
        query += " LIMIT ?";
        queryParams.push(filters.limit);
      }
      const [rows]: any = await connection.query(query, queryParams);

      const repositoryResponse: IExerciseBase[] = rows;

      return repositoryResponse;
    } finally {
      connection.release();
    }
  }
}
