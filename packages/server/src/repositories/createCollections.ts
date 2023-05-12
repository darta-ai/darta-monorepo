/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */

import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {Collections, ICreateCollections} from './types';

@injectable()
export class CreateCollectionsRepository implements ICreateCollections {
  constructor(@inject(Database) private db: Database) {}

  async createCollections(): Promise<void> {
    try {
      await this.db.collection(Collections.Users).create();
      console.log('user collection created');
    } catch (err) {
      console.error('Failed to create collection/s:', err);
    }
    try {
      await this.db.collection(Collections.Artworks).create();
      console.log('artwork collection created');
    } catch (err) {
      console.error('Failed to create collection/s:', err);
    }
    try {
      await this.db.createEdgeCollection(Collections.ArtworkRatingEdge);
      console.log('rating edge collection created');
    } catch (err) {
      console.error('Failed to create collection/s:', err);
    }
    try {
      await this.db.createEdgeCollection(Collections.ArtworkOwnersEdge);
      console.log('owner edge collection created');
    } catch (err) {
      console.error('Failed to create collection/s:', err);
    }
  }
}
