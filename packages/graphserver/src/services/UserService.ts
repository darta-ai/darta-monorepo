import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {CollectionNames, EdgeNames} from '../config/collections';
import {Node} from '../models/models';
import {
  IEdgeService,
  IGalleryService,
  INodeService,
  IUserService,
} from './interfaces';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
  ) {}

  public async createGalleryUserAndEdge({
    uid,
    galleryId,
    email,
    phoneNumber,
    gallery,
    relationship,
    validated,
  }: {
    uid: string;
    galleryId: string;
    email: string;
    phoneNumber: string;
    gallery: string;
    relationship: string;
    validated: boolean;
  }): Promise<any> {
    try {
      await this.createGalleryUser({
        uid,
        email,
        phoneNumber,
        gallery,
        validated,
      });
    } catch (error) {
      throw new Error('Unable to create gallery user');
    }

    try {
      await this.createGalleryEdge({
        galleryId,
        uid,
        relationship,
      });
    } catch (error) {
      throw new Error('Unable to create gallery edge');
    }
  }

  public async createGalleryUser({
    email,
    uid,
    phoneNumber,
    gallery,
  }: {
    email: string;
    uid: string;
    phoneNumber: string;
    gallery: string;
    validated: boolean;
  }): Promise<boolean> {
    try {
      await this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.GalleryUsers,
        key: uid,
        data: {
          value: email,
          uid,
          phone: phoneNumber ?? null,
          gallery: gallery ?? null,
        },
      });
      return true;
    } catch (error) {
      throw new Error('Unable to create gallery user');
    }
  }

  public async readGalleryUser({uid}: {uid: string}): Promise<Node | null> {
    try {
      const results = await this.nodeService.getNode({
        collectionName: CollectionNames.GalleryUsers,
        key: `${CollectionNames.GalleryUsers}/${uid}`,
      });
      if (results) {
        return results;
      }
    } catch (error) {
      throw new Error('Unable to read gallery user');
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  public async deleteGalleryUser(): Promise<boolean> {
    return false;
  }

  public async createGalleryEdge({
    galleryId,
    uid,
    relationship,
  }: {
    galleryId: string;
    uid: string;
    relationship: string;
  }): Promise<boolean> {
    const standarizedGalleryId = galleryId.includes(CollectionNames.Galleries)
      ? galleryId
      : `${CollectionNames.Galleries}/${galleryId}`;
    const standarizedUserId = uid.includes(CollectionNames.GalleryUsers)
      ? uid
      : `${CollectionNames.GalleryUsers}/${uid}`;

    try {
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMUserTOGallery,
        from: standarizedUserId,
        to: standarizedGalleryId,
        data: {
          value: relationship,
        },
      });
      return true;
    } catch (error) {
      throw new Error('Unable to create gallery edge');
    }
  }

  public async readGalleryEdgeRelationship({
    uid,
  }: {
    uid: string;
  }): Promise<string | boolean> {
    try {
      const results = await this.edgeService.getEdgeWithFrom({
        edgeName: EdgeNames.FROMUserTOGallery,
        from: `${CollectionNames.GalleryUsers}/${uid}`,
      });
      return results;
    } catch (error) {
      throw new Error('Unable to read gallery edge relationship');
    }
  }

  public async editGalleryEdge({
    galleryId,
    uid,
    relationship,
  }: {
    galleryId: string;
    uid: string;
    relationship: string;
  }): Promise<any> {
    const fullGalleryId = this.galleryService.generateGalleryId({galleryId});
    const fullUserId = this.generateUserId({uid});

    try {
      const results = await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMUserTOGallery,
        from: fullUserId,
        to: fullGalleryId,
        data: {
          value: relationship,
        },
      });
      return results;
    } catch (error) {
      throw new Error('Unable to edit gallery edge');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private generateUserId({uid}: {uid: string}): string {
    return uid.includes(CollectionNames.GalleryUsers)
      ? uid
      : `${CollectionNames.GalleryUsers}/${uid}`;
  }
}
