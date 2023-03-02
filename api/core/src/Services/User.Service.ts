import { IUserRepository } from "../Repositories/User.Repository";

export interface IUserServiceResponse {
  _id: number;
  username: string;
}

export interface IUserService {
  createUser(username: string): Promise<IUserServiceResponse | null>;
  getUsers(): Promise<IUserServiceResponse[] | null>;
  getUserById(id: number): Promise<IUserServiceResponse | null>;
}

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    this.createUser = this.createUser.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  public async createUser(
    username: string
  ): Promise<IUserServiceResponse | null> {
    let repositoryResponse: IUserServiceResponse | null;

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

  public async getUsers(): Promise<IUserServiceResponse[] | null> {
    const repositoryResponse = await this.userRepository.getUsers();

    if (!repositoryResponse) {
      return [];
    }

    return repositoryResponse;
  }

  public async getUserById(id: number): Promise<IUserServiceResponse | null> {
    const repositoryResponse = await this.userRepository.getUserById(id);

    if (!repositoryResponse) {
      return null;
    }

    return repositoryResponse;
  }
}
