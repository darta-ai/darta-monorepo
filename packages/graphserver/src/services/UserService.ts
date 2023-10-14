import { GalleryPreview, Images } from '@darta-types/dist';
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


  public async createDartaUserGalleryRelationship({uid, galleryId} : {uid: string, galleryId: string}): Promise<void> {
    const galleryUserId = this.galleryService.generateGalleryId({galleryId});
    const id = await this.getLocalStorageIdFromUID({uid});
    const userId = this.generateDartaUserId({localStorageUid: id});
    try {
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMDartaUserTOGalleryFOLLOWS,
        from: userId,
        to: galleryUserId,
        data: {

          createdAt: new Date().toISOString(),
        }
      });
    } catch (error) {
      throw new Error('unable to create darta user gallery connection');
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
      const results = await this.nodeService.getNodeByKey({
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

  public async readDartaUser({localStorageUid}: {localStorageUid: string}): Promise<Node | null>{
    const id = this.generateDartaUserId({localStorageUid});
    try {
      const results = await this.nodeService.getNodeById({
        collectionName: CollectionNames.DartaUsers,
        id,
      });
      if (results) {
        return results;
      }
    } catch (error) {
      throw new Error('Unable to read darta user');
    }
    return null;
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
    const fullUserId = this.generateDartaUserId({localStorageUid});
    
    // ##### profile picture #####

    // const profilePic = await this.getUserProfilePicture({uid});

    // Don't overwrite an image
    let fileName: string = crypto.randomUUID();
    if (profilePicture?.fileName) {
      fileName = profilePicture.fileName;
    }

    let bucketName = profilePicture?.bucketName ?? BUCKET_NAME;
    let value = profilePicture?.value ?? null;

    if (profilePicture?.fileData && typeof profilePicture?.fileData === 'string') {
      
      try {
        const artworkImageResults =
          await this.imageController.processUploadImage({
            fileBuffer: profilePicture?.fileData,
            fileName,
            bucketName,
          });
        ({bucketName, value} = artworkImageResults);
      } catch (error) {
        throw new Error('error uploading image');
      }
    }

    const results = await this.nodeService.upsertNodeById({
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
    return results
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
    public async deleteDartaUser({localStorageUid} : {localStorageUid: string}): Promise<boolean> {
      try {
        const id = this.generateDartaUserId({localStorageUid});
        await this.nodeService.deleteNode({
          collectionName: CollectionNames.DartaUsers,
          id,
        });

        const deletePromises = Object.values(EdgeNames).map((edgeName) => this.edgeService.deleteEdgeWithFrom({
            edgeName,
            from: id,
          })
          .catch((error) => {
            // Handle or log individual error
            console.error(`Error deleting edge ${edgeName} for user ${id}:`, error);
            
            // Return a custom error object to collate later if desired
            return { error: true, edgeName, errorMessage: error.message };
          }));
        
        const results = await Promise.all(deletePromises);
        
        // Check for any errors in the results
        const errors = results.filter(result => result?.error);
        
        if (errors.length) {
          // Handle the collated errors in some way
          // This is optional and depends on how you'd like to manage multiple errors
          console.error('Errors occurred during edge deletion:', errors);
        }
        
        return true;
      } catch (error) {
        throw new Error('Unable to delete darta user');
      }
    }

  public async deleteDartaUserGalleryRelationship({uid, galleryId} : {uid: string, galleryId: string}): Promise<void> {
    const galleryUserId = this.galleryService.generateGalleryId({galleryId});
    const id = await this.getLocalStorageIdFromUID({uid});
    const userId = this.generateDartaUserId({localStorageUid: id});
      try {
        await this.edgeService.deleteEdge({
          edgeName: EdgeNames.FROMDartaUserTOGalleryFOLLOWS,
          from: userId,
          to: galleryUserId
        });
      } catch (error) {
        throw new Error('unable to create darta user gallery connection');
      }
    }
  
    public async listDartaUserFollowsGallery({uid} : {uid: string}): Promise<GalleryPreview[]>{
    
      try{
        const id = await this.getLocalStorageIdFromUID({uid});
        const userId = this.generateDartaUserId({localStorageUid: id});
        const query = `
          WITH ${CollectionNames.Galleries}, ${CollectionNames.DartaUsers}, ${EdgeNames.FROMDartaUserTOGalleryFOLLOWS}
          FOR v, e IN 1..1 OUTBOUND @userId ${EdgeNames.FROMDartaUserTOGalleryFOLLOWS}
          RETURN {
            galleryName: v.galleryName,
            galleryId: v._id,
            galleryLogo: v.galleryLogo,
          }
        `;
        const cursor = await this.db.query(query, {
          userId,
        });
        const galleries: GalleryPreview[] = await cursor.all();
        return galleries
      } catch (error: any){
        throw new Error(error)
      }
  
    }
  

      // eslint-disable-next-line class-methods-use-this
  public generateGalleryUserId({uid}: {uid: string}): string {
    return uid.includes(CollectionNames.GalleryUsers)
      ? uid
      : `${CollectionNames.GalleryUsers}/${uid}`;
  }

  // eslint-disable-next-line class-methods-use-this
  public generateDartaUserId({localStorageUid}: {localStorageUid: string}): string {
    return localStorageUid.includes(CollectionNames.DartaUsers)
      ? localStorageUid
      : `${CollectionNames.DartaUsers}/${localStorageUid}`;
  }

  private async getUserProfilePicture({uid}: {uid: string}): Promise<any> {
    const exhibitionKey = this.getLocalStorageIdFromUID({uid})
    const findGalleryKey = `
      LET doc = DOCUMENT(@key)
      RETURN {
        exhibitionPrimaryImage: doc.exhibitionPrimaryImage
      }
    `;

    try {
      const cursor = await this.db.query(findGalleryKey, {key: exhibitionKey});
      const exhibitionPrimaryImage: Images = await cursor.next();
      return exhibitionPrimaryImage;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getLocalStorageIdFromUID({uid}: {uid: string}): Promise<string>{
    try {
      const query = `
        FOR user in ${CollectionNames.DartaUsers}
        FILTER user.uid == @uid
        RETURN user.localStorageUid
      `

      const cursor = await this.db.query(query, {uid});

      const results = await cursor.next();
      if (results) {
        return results;
      }
    } catch (error) {
      throw new Error('Unable to read darta user');
    }
    return '';
  }
}
