/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import {aql, Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {User, UserService} from './types';

@injectable()
export class ArangoUserService implements UserService {
  constructor(@inject(Database) private db: Database) {}

  async getUser(key: string): Promise<User | null> {
    const cursor = await this.db.query(aql`
      FOR user IN users
        FILTER user._key == ${key}
        RETURN user
    `);
    const result = await cursor.all();
    return result.length ? result[0] : null;
  }

  async createUser(user: User): Promise<User> {
    const cursor = await this.db.query(aql`
      INSERT ${user} INTO users
      RETURN NEW
    `);
    const result = await cursor.all();
    return result[0];
  }

  async updateUser(user: User): Promise<User> {
    const cursor = await this.db.query(aql`
      UPDATE ${user._key} WITH ${user} IN users
      RETURN NEW
    `);
    const result = await cursor.all();
    return result[0];
  }
}
