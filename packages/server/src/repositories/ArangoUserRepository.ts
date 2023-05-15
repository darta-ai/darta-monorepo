/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import {aql, Database} from 'arangojs';
import crypto from 'crypto';
import {inject, injectable} from 'inversify';

import {IUserRepository, Rating, User} from '../types';

@injectable()
export class ArangoUserRepository implements IUserRepository {
  constructor(@inject(Database) private db: Database) {}

  async getUser(deviceId: string): Promise<User | null> {
    console.log('deviceId', deviceId);
    const cursor = await this.db.query(
      `
        FOR user IN users 
        FILTER user.deviceId == @deviceId
        RETURN user
      `,
      {deviceId},
    );
    const result = await cursor.all();
    return result.length ? result[0] : null;
  }

  async createUser(user: User): Promise<User> {
    const createdAt = new Date().toISOString();
    const u = user;
    u.createdAt = createdAt;
    u.userId = crypto.randomUUID();
    u.likedArtworks = {};
    u.savedArtworks = {};
    u.dislikedArtworks = {};
    try {
      const cursor = await this.db.query(aql`
      UPSERT { deviceId: ${u.deviceId} }
      INSERT ${u}
      UPDATE {}
      IN users
      RETURN NEW
    `);
      const result = await cursor.all();
      return result[0];
    } catch (error) {
      console.log(error);
      return user;
    }
  }

  async updateUser(user: User): Promise<User> {
    const updatedAt = new Date().toISOString();
    const u = user;
    u.updatedAt = updatedAt;
    const cursor = await this.db.query(aql`
      FOR u IN users
      FILTER u.deviceId == ${user.deviceId}
      UPDATE u WITH ${user} IN users
      RETURN NEW
    `);
    const result = await cursor.all();
    return result[0];
  }

  // NOT WORKING
  async addRatingIdToUser(userKey: string, rating: Rating): Promise<User> {
    const edgeKey = rating._key;
    const updatedAt = new Date().toISOString();

    const cursor = await this.db.query(aql`
      LET user = DOCUMENT("users/${userKey}")
      LET edgeKey = "${edgeKey}"
      LET updatedLikedArtworks = MERGE(user.likedArtworks, {[${edgeKey}]: ${edgeKey}})
      UPDATE user WITH {likedArtworks: updatedLikedArtworks, updatedAt: "${updatedAt}"} IN users
    `);

    const result = await cursor.all();
    return result[0];
  }
}
