import { inject, injectable } from "inversify";
import { IUser, IUserRepository } from "../Repositories/User.Repository";

export interface IUserService {
  createUser(username: string): Promise<IUser | null>;
  getUsers(): Promise<IUser[] | null>;
  getUserById(id: number): Promise<IUser | null>;
}

@injectable()
export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(@inject("IUserRepository") userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.createUser = this.createUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  public async createUser(username: string): Promise<IUser | null> {
    let repositoryResponse: IUser | null;

    repositoryResponse = await this.userRepository.getUserByUsername(username);
    if (repositoryResponse) {
      return null;
    }

    repositoryResponse = await this.userRepository.createUser(username);
    if (!repositoryResponse) {
      return null;
    }

    return repositoryResponse;
  }

  public async getUsers(): Promise<IUser[] | null> {
    const repositoryResponse = await this.userRepository.getUsers();

    if (!repositoryResponse) {
      return [];
    }

    return repositoryResponse;
  }

  public async getUserById(id: number): Promise<IUser | null> {
    const repositoryResponse = await this.userRepository.getUserById(id);

    if (!repositoryResponse) {
      return null;
    }

    return repositoryResponse;
  }
}
