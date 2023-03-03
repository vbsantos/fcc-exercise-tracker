import { Repository } from "./Repository";

export interface IExerciseBase {
  description: string;
  duration: number;
  date?: Date;
}

export interface IExercise extends IExerciseBase {
  _id: number;
  user_id: number;
}

export interface ILogFilters {
  from?: Date | undefined;
  to?: Date | undefined;
  limit?: number | undefined;
}

export interface IExerciseRepository {
  createExercise(
    userId: number,
    exerciseDescription: string,
    exerciseDuration: number,
    exerciseDate?: Date
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
    exerciseDate?: Date
  ): Promise<IExercise> {
    const connection = await this.pool.getConnection();

    try {
      const [result]: any = await connection.query(
        "INSERT INTO exercise_tracker_exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)",
        [userId, exerciseDescription, exerciseDuration, exerciseDate]
      );

      const repositoryResponse: IExercise = {
        _id: result.insertId,
        user_id: userId,
        description: exerciseDescription,
        duration: exerciseDuration,
        date: exerciseDate,
      };

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
