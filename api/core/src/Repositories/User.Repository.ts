import { injectable } from "inversify";
import { Repository } from "./Repository";

export interface IUser {
  _id: number;
  username: string;
}

export interface IUserRepository {
  getUserById(id: number): Promise<IUser | null>;
  createUser(username: string): Promise<IUser | null>;
  getUsers(): Promise<IUser[] | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
}

@injectable()
export class UserRepository extends Repository implements IUserRepository {
  constructor() {
    super();
  }

  public async createUser(
    username: string
  ): Promise<IUser | null> {
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

  public async getUsers(): Promise<IUser[] | null> {
    const connection = await this.pool.getConnection();

    try {
      const [result]: any = await connection.query(
        "SELECT _id, username FROM exercise_tracker_users"
      );

      const response: IUser[] = result;

      return response;
    } finally {
      connection.release();
    }
  }

  public async getUserByUsername(
    username: string
  ): Promise<IUser | null> {
    const connection = await this.pool.getConnection();

    try {
      const [rows]: any = await connection.query(
        "SELECT _id, username FROM exercise_tracker_users WHERE username = ?",
        [username]
      );

      if (rows.length === 0) {
        return null;
      }

      const response: IUser = rows[0];

      return response;
    } finally {
      connection.release();
    }
  }

  async getUserById(id: number): Promise<IUser | null> {
    const connection = await this.pool.getConnection();

    try {
      const [rows]: any = await connection.query(
        "SELECT _id, username FROM exercise_tracker_users WHERE _id = ?",
        [id]
      );

      if (rows.length === 0) {
        return null;
      }

      const response: IUser = rows[0];

      return response;
    } finally {
      connection.release();
    }
  }
}
