import {inject, injectable} from 'inversify';

import {IUserRepository, User} from '../types';

@injectable()
export class UserService {
  constructor(
    @inject('IUserRepository') private userRepository: IUserRepository,
  ) {
    this.userRepository = userRepository;
  }

  public async userLogin(deviceId: string) {
    const user = await this.userRepository.getUser(deviceId);
    if (user) {
      return user;
    }
    const newUser = await this.userRepository.createUser({deviceId});
    return newUser;
  }

  public async updateUser(user: User) {
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
