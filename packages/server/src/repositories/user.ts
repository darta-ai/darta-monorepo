/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import {aql, Database} from 'arangojs';
import crypto from 'crypto';
import {inject, injectable} from 'inversify';

import {Collections, IUserRepository, Rating, User} from './types';

@injectable()
export class ArangoUserRepository implements IUserRepository {
  constructor(@inject(Database) private db: Database) {}

  async getUser(deviceId: string): Promise<User | null> {
    const cursor = await this.db.query(aql`
        FOR user IN ${Collections.Users}
          FILTER user.deviceId == ${deviceId}
          RETURN user
      `);
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
      IN ${Collections.Users}
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
      FOR u IN ${Collections.Users}
      FILTER u.deviceId == ${user.deviceId}
      UPDATE u WITH ${user} IN ${Collections.Users}
      RETURN NEW
    `);
    const result = await cursor.all();
    return result[0];
  }

  // NOT WORKING
  async addLikedArtworkToUser(userKey: string, rating: Rating): Promise<User> {
    const edgeKey = rating._key;
    const updatedAt = new Date().toISOString();

    const cursor = await this.db.query(aql`
      LET user = DOCUMENT("${Collections.Users}/${userKey}")
      LET edgeKey = "${edgeKey}"
      LET updatedLikedArtworks = MERGE(user.likedArtworks, {[${edgeKey}]: ${edgeKey}})
      UPDATE user WITH {likedArtworks: updatedLikedArtworks, updatedAt: "${updatedAt}"} IN ${Collections.Users}
    `);

    const result = await cursor.all();
    return result[0];
  }

  // NOT WORKING
  async addSavedArtworkToUser(userKey: string, edge: Rating): Promise<User> {
    const edgeKey = edge._key;
    const updatedAt = new Date().toISOString();

    const cursor = await this.db.query(aql`
      LET user = DOCUMENT("${Collections.Users}/${userKey}")
      LET edgeKey = "${edgeKey}"
      LET updatedLikedArtworks = MERGE(user.savedArtwork, {[edgeKey]: edgeKey})
      UPDATE user WITH {savedArtwork: updatedLikedArtworks, updatedAt: "${updatedAt}"} IN ${Collections.Users}
    `);

    const result = await cursor.all();
    return result[0];
  }
}
