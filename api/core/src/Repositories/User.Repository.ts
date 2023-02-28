import { Repository } from "./Repository";

export interface IUserRepositoryResponse {
  _id: number;
  username: string;
}

export interface IUserRepository {
  createUser(username: string): Promise<IUserRepositoryResponse | null>;
  getUsers(): Promise<IUserRepositoryResponse[]>;
  getUserByUsername(username: string): Promise<IUserRepositoryResponse | null>;
}

export class UserRepository extends Repository implements IUserRepository {
  constructor() {
    super();
  }

  public async createUser(
    username: string
  ): Promise<IUserRepositoryResponse | null> {
    const connection = await this.pool.getConnection();

    try {
      const [result]: any = await connection.query(
        "INSERT INTO exercise_tracker_users (username) VALUES(?)",
        [username]
      );

      return {
        _id: result.insertId,
        username,
      };
    } finally {
      connection.release();
    }
  }

  public async getUsers(): Promise<IUserRepositoryResponse[]> {
    const connection = await this.pool.getConnection();

    try {
      const [result]: any = await connection.query(
        "SELECT _id, username FROM exercise_tracker_users"
      );

      const response: IUserRepositoryResponse[] = result;

      return response;
    } finally {
      connection.release();
    }
  }

  public async getUserByUsername(
    username: string
  ): Promise<IUserRepositoryResponse | null> {
    const connection = await this.pool.getConnection();

    try {
      const [rows]: any = await connection.query(
        "SELECT _id, username FROM exercise_tracker_users WHERE username = ?",
        [username]
      );

      if (rows.length === 0) {
        return null;
      }

      const response: IUserRepositoryResponse = rows[0];

      return response;
    } finally {
      connection.release();
    }
  }
}
