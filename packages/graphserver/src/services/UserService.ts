import { Images } from '@darta-types/dist';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {CollectionNames, EdgeNames} from '../config/collections';
import { ImageController } from '../controllers';
import {Node} from '../models/models';
import {
  IEdgeService,
  IGalleryService,
  INodeService,
  IUserService,
} from './interfaces';

const BUCKET_NAME = 'darta-profile-pictures';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
    @inject('ImageController')
    private readonly imageController: ImageController,
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


  public async createDartaUser({
    localStorageUid,
  }: {
    localStorageUid: string;
  }): Promise<boolean> {
    try {
      await this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.DartaUsers,
        key: localStorageUid,
        data: {
          value: localStorageUid,
          localStorageUid,
        },
      });
      return true;
    } catch (error) {
      throw new Error('Unable to create gallery user');
    }
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
    const fullGalleryId = this.galleryService.generateGalleryUserId({galleryId});
    const fullUserId = this.generateGalleryUserId({uid});

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


  public async editDartaUser({
    profilePicture,
    userName,
    legalFirstName,
    legalLastName,
    email,
    uid,
    localStorageUid,
  }: {
    profilePicture?: Images
    userName?: string;
    legalFirstName?: string;
    legalLastName?: string;
    email?: string;
    uid?: string;
    localStorageUid: string;
  }): Promise<any> {
    if (!localStorageUid) {
      throw new Error('Unable to edit darta user');
    }
    console.log('triggered')
    const fullUserId = this.generateDartaUserId({uid: localStorageUid});
    
    // ##### profile picture #####

    // Don't overwrite an image
    let fileName: string = crypto.randomUUID();
    if (profilePicture?.fileName) {
      fileName = profilePicture.fileName;
    }

    let bucketName = profilePicture?.bucketName ?? null;
    let value = profilePicture?.value ?? null;

    if (profilePicture?.fileData) {
      try {
        const artworkImageResults =
          await this.imageController.processUploadImage({
            fileBuffer: profilePicture?.fileData,
            fileName,
            bucketName: BUCKET_NAME,
          });
        ({bucketName, value} = artworkImageResults);
      } catch (error) {
        throw new Error('error uploading image');
      }
    }

    await this.nodeService.upsertNodeById({
      collectionName: CollectionNames.DartaUsers,
      id: fullUserId,
      data: {
        userName,
        uid,
        email,
        legalFirstName,
        legalLastName,
        profilePicture: {
          fileName,
          bucketName,
          value,
        }
      },
    });

    throw new Error('Method not implemented');

  }

  // eslint-disable-next-line class-methods-use-this
  public async checkIfGalleryUserExists({uid}: {uid: string}): Promise<boolean>{
    throw new Error(`Method not implemented ${uid}`);
  }

    // eslint-disable-next-line class-methods-use-this
    public async deleteGalleryUser(): Promise<boolean> {
      return false;
    }

    // eslint-disable-next-line class-methods-use-this
    public deleteDartaUser(): Promise<boolean> {
      throw new Error('Method not implemented.');
    }

      // eslint-disable-next-line class-methods-use-this
  private generateGalleryUserId({uid}: {uid: string}): string {
    return uid.includes(CollectionNames.GalleryUsers)
      ? uid
      : `${CollectionNames.GalleryUsers}/${uid}`;
  }

  // eslint-disable-next-line class-methods-use-this
  private generateDartaUserId({uid}: {uid: string}): string {
    return uid.includes(CollectionNames.DartaUsers)
      ? uid
      : `${CollectionNames.DartaUsers}/${uid}`;
  }
}
