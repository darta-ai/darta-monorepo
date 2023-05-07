export interface User {
  _key: string;
  username: string;
  deviceId: string;
  uuid: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  legalName?: string;
}

export interface UserService {
  getUser(key: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  createUser(user: User): Promise<User>;
}
