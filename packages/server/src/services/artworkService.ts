/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as joi from '@hapi/joi';
import {aql, Database} from 'arangojs';
import crypto from 'crypto';
import {inject, injectable} from 'inversify';

import {
  Artwork,
  artworkSchema,
  ArtworkService,
  updateArtworkSchema,
} from './types';

@injectable()
export class ArangoArtworkService implements ArtworkService {
  constructor(@inject(Database) private db: Database) {}

  async getArtwork(key: string): Promise<Artwork | null> {
    const cursor = await this.db.query(aql`
        FOR artwork IN artworks
          FILTER artwork._key == ${key}
          RETURN artwork
      `);
    const result = await cursor.all();
    return result.length ? result[0] : null;
  }

  async createArtwork(artwork: Artwork): Promise<Artwork> {
    const createdAt = new Date().toISOString();
    const art: Artwork = artwork;
    art.createdAt = createdAt;
    art.artworkId = crypto.randomUUID();

    try {
      joi.attempt(art, artworkSchema);
    } catch (e: any) {
      throw new Error(e.message);
    }

    try {
      const cursor = await this.db.query(aql`
      UPSERT { slug: ${art.slug} }
      INSERT ${art}
      UPDATE {}
      IN artworks
      RETURN NEW
    `);
      const result = await cursor.all();
      return result[0];
    } catch (error) {
      console.log(error);
      throw new Error('unable to add to db');
    }
  }

  async updateArtwork(artwork: Artwork): Promise<Artwork> {
    const updatedAt = new Date().toISOString();
    const art = artwork;
    art.updatedAt = updatedAt;

    const cursor = await this.db.query(aql`
      FOR a IN artworks
      FILTER a.slug == ${art.slug}
      UPDATE a WITH ${art} IN artworks
      RETURN NEW
    `);
    const result = await cursor.all();
    return result[0];
  }
}
