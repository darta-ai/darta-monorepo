/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */

import * as joi from '@hapi/joi';
import {aql, Database} from 'arangojs';
import crypto from 'crypto';
import {inject, injectable} from 'inversify';

import {
  Artwork,
  artworkSchema,
  IArtworkRepository,
  updateArtworkSchema,
} from '../types';

@injectable()
export class ArangoArtworkRepository implements IArtworkRepository {
  constructor(@inject(Database) private db: Database) {}

  async getArtwork(slug: string): Promise<Artwork | null> {
    const cursor = await this.db.query(aql`
          FOR artwork IN artworks
          FILTER artwork.slug == ${slug}
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

    try {
      joi.attempt(art, updateArtworkSchema);
    } catch (e: any) {
      throw new Error(e.message);
    }

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
