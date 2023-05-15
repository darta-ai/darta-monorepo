import {inject, injectable} from 'inversify';

import {IUserRepository, IUserService, User} from '../types';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async userLogin(deviceId: string): Promise<User | null> {
    const user = await this.userRepository.getUser(deviceId);
    if (user) {
      return user;
    }
    const newUser = await this.userRepository.createUser({deviceId});
    if (newUser) {
      return newUser;
    }
    throw new Error('Failed to create user');
  }

  public async updateUser(user: User): Promise<User | void> {
    try {
      const createdUser = await this.userRepository.updateUser(user);
      if (createdUser) {
        return createdUser;
      }
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update user');
    }
  }
}
