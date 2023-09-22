import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';
import {Client} from 'minio';

import {CollectionNames, EdgeNames} from '../config/collections';
import {IAdminService} from './interfaces';

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('MinioClient') private readonly minio: Client,
  ) {}

  public async validateAndCreateCollectionsAndEdges(): Promise<void> {
    const collectionNames = Object.values(CollectionNames);
    const edgeNames = Object.values(EdgeNames);
    collectionNames.map(async collectionName => {
      await this.ensureCollectionExists(collectionName);
    });

    edgeNames.map(async collectionName => {
      await this.ensureEdgeExists(collectionName);
    });
  }

  public async addApprovedGallerySDL(sdl: string): Promise<string> {
    const query = `
        FOR doc IN ${CollectionNames.GalleryApprovals}
        LET updatedArray = (@sdl NOT IN doc.approved) ? APPEND(doc.approved, [@sdl]) : doc.approved
        UPDATE doc WITH {
            approved: updatedArray
        } IN ${CollectionNames.GalleryApprovals}
        RETURN doc
    `;

    const cursor = await this.db.query(query, {sdl});
    const results = await cursor.next();
    if (results?.approved.includes(sdl)) {
      return `added ${sdl}`;
    } else {
      return `failed to add ${sdl}`;
    }
  }

  public async addMinioBucker(bucketName: string): Promise<string> {
    try {
      await this.minio.makeBucket(bucketName);
      return `added ${bucketName}`;
    } catch (error: any) {
      console.log(error);
      throw new Error(`failed to add ${bucketName}: ${error.message}`);
    }
  }

  private async ensureCollectionExists(collectionName: string) {
    try {
      await this.db.collection(collectionName).get();
    } catch (err: any) {
      if (err.isArangoError && err.errorNum === 1203) {
        // ARANGO_DATA_SOURCE_NOT_FOUND
        await this.db.createCollection(collectionName);
      } else {
        throw err;
      }
    }
  }

  private async ensureEdgeExists(collectionName: string) {
    try {
      await this.db.collection(collectionName).get();
    } catch (err: any) {
      if (err.isArangoError && err.errorNum === 1203) {
        // ARANGO_DATA_SOURCE_NOT_FOUND
        await this.db.createEdgeCollection(collectionName);
      } else {
        throw err;
      }
    }
  }
}
