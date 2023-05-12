/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */

import * as joi from '@hapi/joi';
import {aql, Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {
  Collections,
  IRatingRepository,
  Rating,
  ratingSchema,
  UserArtworkEdge,
} from './types';

type RatingEdge = UserArtworkEdge & {_key: string; _id: string};
@injectable()
export class ArangoRatingRepository implements IRatingRepository {
  constructor(@inject(Database) private db: Database) {}

  async createUserArtworkEdge(
    artworkRating: Rating,
  ): Promise<RatingEdge | null> {
    const createdAt = new Date().toISOString();
    const rating: Rating = artworkRating;
    rating.createdAt = createdAt;

    try {
      joi.attempt(rating, ratingSchema);
    } catch (e: any) {
      throw new Error(e.message);
    }

    const edge: UserArtworkEdge = {
      _from: `Users/${rating.userKey}`, // The _key of the User document
      _to: `Artworks/${rating.artworkKey}`, // The _key of the Artwork document
      ...artworkRating,
    };

    try {
      const query = aql`
        INSERT ${edge} INTO ${Collections.ArtworkRatingEdge}
        RETURN NEW
    `;

      const cursor = await this.db.query(query);
      const result = await cursor.next();

      // Return the created edge with the generated _key and _id
      return {...edge, _key: result._key, _id: result._id};
    } catch (error) {
      console.log(error);
      throw new Error('unable to add to db');
    }
  }

  async updateUserArtworkEdge(artworkRating: Rating): Promise<RatingEdge> {
    const updatedAt = new Date().toISOString();
    const rating = artworkRating;
    rating.updatedAt = updatedAt;

    const edge: UserArtworkEdge = {
      _from: `Users/${rating.userKey}`, // The _key of the User document
      _to: `Artworks/${rating.artworkKey}`, // The _key of the Artwork document
      ...artworkRating,
    };
    try {
      // AQL query to insert the edge
      const query = aql`
      FOR edge IN ${Collections.ArtworkRatingEdge}
      FILTER edge._from == ${edge._from} && edge._to == ${edge._to}
      UPDATE edge WITH ${edge} IN ${Collections.ArtworkRatingEdge}
      RETURN NEW
    `;

      const cursor = await this.db.query(query);
      const result = await cursor.next();

      // Return the created edge with the generated _key and _id
      return result;
    } catch (error) {
      console.log(error);
      throw new Error('unable to add to db');
    }
  }

  async getUserArtworkEdge(userKey: string): Promise<Rating[] | undefined> {
    try {
      const cursor = await this.db.query(aql`
    FOR rating IN ${Collections.ArtworkRatingEdge}
    FILTER rating._from == Users/${userKey}
    COLLECT status = rating.artworkRating INTO groups = rating.artworkKey
    RETURN {status, artworkIDs: groups}
  `);

      const result = await cursor.all();
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
