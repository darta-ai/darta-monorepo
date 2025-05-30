import { GalleryPreview, Images, MobileUser } from '@darta-types';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {CollectionNames, EdgeNames} from '../config/collections';
import { ENV } from '../config/config';
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
    } catch (error: any) {
      throw new Error(`Unable to create gallery user ${error?.message}`);
    }

    try {
      await this.createGalleryEdge({
        galleryId,
        uid,
        relationship,
      });
    } catch (error: any) {
      throw new Error(`Unable to create gallery edge ${error?.message}`);
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
    } catch (error: any) {
      throw new Error(`Unable to create gallery user ${error?.message}`);
    }
  }


  public async createDartaUserGalleryRelationship({uid, galleryId} : {uid: string, galleryId: string}): Promise<void> {
    const galleryUserId = this.galleryService.generateGalleryId({galleryId});
    const userId = this.generateDartaUserId({uid});
    try {
      const followsGallery = await this.edgeService.getEdge({
        edgeName: EdgeNames.FROMDartaUserTOGalleryFOLLOWS,
        from: userId,
        to: galleryUserId
      });
      if (followsGallery) {
        throw new Error('user already follows gallery')
      }
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMDartaUserTOGalleryFOLLOWS,
        from: userId,
        to: galleryUserId,
        data: {
          createdAt: new Date().toISOString(),
        }
      });
    } catch (error:any) {
      throw new Error(`unable to create darta user gallery connection ${error?.message}`);
    }
  }


  public async createDartaUser({
    uid,
  }: {
    uid: string;
  }): Promise<boolean> {
    try {
      await this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.DartaUsers,
        key: uid,
        data: {
          value: uid,
          createdAt: new Date().toISOString(),
        },
      });
      return true;
    } catch (error: any) {
      throw new Error(`Unable to create darta user ${error?.message}`);
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
    } catch (error: any) {
      throw new Error(`Unable to create gallery edge ${error?.message}`);
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
    } catch (error: any) {
      throw new Error(`Unable to read gallery user ${error?.message}`);
    }
    return null;
  }


  public async readAllUsers(): Promise<void>{
    const query = `
      WITH ${CollectionNames.DartaUsers}
      FOR user IN ${CollectionNames.DartaUsers}
      RETURN {
        userId: user._id,
      }`

    try {
      const cursor = await this.db.query(query);
      const users = await cursor.all();
      const promises = [];
      for (const user of users) {
        promises.push(this.readDartaUser({uid: user.userId}));
      }
      await Promise.allSettled(promises);
    }
    catch (error: any) {
      throw new Error(`Unable to read all users ${error?.message}`);
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
    } catch (error:any) {
      throw new Error(`Unable to read gallery edge ${error?.message}`);
    }
  }

  public async readDartaUser({uid}: {uid: string}): Promise<MobileUser | null>{
    const id = this.generateDartaUserId({uid});
    try {
      const results = await this.nodeService.getNodeById({
        collectionName: CollectionNames.DartaUsers,
        id,
      });
      let userProfilePicture;

      if(results?.profilePicture){
        (userProfilePicture = results.profilePicture)
      }
      
      let shouldRegenerate;
      if (userProfilePicture?.value) {
        shouldRegenerate = await this.imageController.shouldRegenerateUrl({url: userProfilePicture.value})
      }

      let profilePictureLarge = userProfilePicture?.value;
      let profilePictureMedium = userProfilePicture?.mediumImage?.value;
      let profilePictureSmall = userProfilePicture?.smallImage?.value;

      if (shouldRegenerate && ENV === 'production' && userProfilePicture?.bucketName && userProfilePicture?.fileName) {
        try {
          profilePictureLarge = await this.imageController.processGetFile({
            bucketName: userProfilePicture?.bucketName,
            fileName: userProfilePicture?.fileName,
          });
          if (profilePictureMedium) {
            profilePictureMedium = await this.imageController.processGetFile({
              bucketName: userProfilePicture?.mediumImage.bucketName,
              fileName: userProfilePicture?.mediumImage.fileName,
            });
          }
          if (profilePictureSmall) {
            profilePictureSmall = await this.imageController.processGetFile({
              bucketName: userProfilePicture?.smallImage.bucketName,
              fileName: userProfilePicture?.smallImage.fileName,
            });
          }
          await this.refreshUserProfileImage({uid: results?._id, 
            mainUrl: profilePictureLarge,
            mediumUrl: profilePictureMedium,
            smallUrl: profilePictureSmall})
        } catch (error: any) {
          // eslint-disable-next-line no-console
          profilePictureLarge = '';
        }
      } else {
        profilePictureLarge = userProfilePicture?.value;
      }

      if(results){
        return {
          profilePicture: {
            value: profilePictureLarge,
            mediumImage: {
              value: profilePictureMedium,
            },
            smallImage: {
              value: profilePictureSmall,
            }
          },
          userName: results.userName,
          legalFirstName: results.legalFirstName,
          legalLastName: results.legalLastName,
          email: results.email,
          uid: results._id,
          expoPushToken: results.expoPushToken,
          routeGenerationCount: results?.routeGenerationCount,
        }
      }

    } catch (error: any) {
      throw new Error(`Unable to read darta user ${error?.message}`);
    }
    return null;
  }

  public async saveExpoPushToken({uid, expoPushToken}: {uid: string, expoPushToken: string}): Promise<void> {
    const fullUserId = this.generateDartaUserId({uid});
    try {

      const user = await this.nodeService.getNodeById({
        collectionName: CollectionNames.DartaUsers,
        id: fullUserId,
      });
      if (!user) {
        throw new Error('user not found');
      }
      if (user.expoPushToken === expoPushToken) {
        return;
      }

      await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.DartaUsers,
        id: fullUserId,
        data: {
          expoPushToken,
        },
      });
    } catch (error: any) {
      throw new Error(`Unable to save expo push token ${error?.message}`);
    }
  }

  public async editGalleryToUserEdge({
    galleryId,
    uid,
    relationship,
  }: {
    galleryId: string;
    uid: string;
    relationship: string;
  }): Promise<any> {
    const fullGalleryId = this.galleryService.generateGalleryId({galleryId});
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
    } catch (error: any) {
      throw new Error(`Unable to edit gallery edge ${error?.message}`);
    }
  }


  public async editDartaUser({
    profilePicture,
    userName,
    legalFirstName,
    legalLastName,
    email,
    uid,
    expoPushToken,
    recommendationArtworkIds
  }: {
    profilePicture?: Images
    userName?: string;
    legalFirstName?: string;
    legalLastName?: string;
    email?: string;
    uid: string;
    expoPushToken?: string;
    recommendationArtworkIds?: string[];
  }): Promise<any> {
    if (!uid) return false;
    // const fullUserId = this.generateDartaUserId({uid});
    
    // ##### profile picture #####

    // const profilePic = await this.getUserProfilePicture({uid});

    // Don't overwrite an image

    let profilePic: Images = {}

    try{
      profilePic = await this.getUserProfilePicture({uid});
    } catch (error) {
      // eslint-disable-next-line no-console
    }
    
    let fileName: string = crypto.randomUUID();
    if (profilePicture?.fileName) {
      fileName = profilePicture.fileName;
    }

    const bucketName = profilePic?.bucketName ?? BUCKET_NAME;
    const value = profilePic?.value ?? null;


    let mediumImage = profilePic
    // eslint-disable-next-line prefer-destructuring
    let smallImage = profilePic?.smallImage

    if (profilePicture?.fileData && typeof profilePicture?.fileData === 'string') {
      try {
        const artworkImageResults =
          await this.imageController.processUploadImage({
            fileBuffer: profilePicture?.fileData,
            fileName,
            bucketName,
          });
          for (const result of artworkImageResults) {
            if (result.size === 'mediumImage') mediumImage = result;
            else if (result.size === 'smallImage') smallImage = result;
          }
          // HERE
        // ({bucketName, value} = artworkImageResults);
      } catch (error) {
        throw new Error('error uploading image');
      }
    }

    const results = await this.nodeService.upsertNodeByKey({
      collectionName: CollectionNames.DartaUsers,
      key: uid,
      data: {
        userName,
        uid,
        email,
        legalFirstName,
        legalLastName,
        expoPushToken,
        recommendationArtworkIds,
        profilePicture: {
          fileName: mediumImage?.fileName ?? fileName,
          bucketName: mediumImage?.bucketName ?? bucketName,
          value: mediumImage?.value ?? value,
          mediumImage: {
            fileName: mediumImage?.fileName,
            bucketName: mediumImage?.bucketName,
            value: mediumImage?.value,
          },
          smallImage: {
            fileName: smallImage?.fileName,
            bucketName: smallImage?.bucketName,
            value: smallImage?.value,
          },
          }
        }
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
    public async deleteDartaUser({uid} : {uid: string}): Promise<boolean> {
      try {
        const id = this.generateDartaUserId({uid});
        await this.nodeService.deleteNode({
          collectionName: CollectionNames.DartaUsers,
          id,
        });

        const deletePromises = Object.values(EdgeNames).map((edgeName) => this.edgeService.deleteEdgeWithFrom({
            edgeName,
            from: id,
          })
          .catch((error) => 
            // Handle or log individual error
                         ({ error: true, edgeName, errorMessage: error?.message })
          ));
        
        const results = await Promise.all(deletePromises);
        
        // Check for any errors in the results
        const errors = results.filter(result => result?.error);
        
        if (errors.length) {
          // Handle the collated errors in some way
        }
        
        return true;
      } catch (error) {
        throw new Error('Unable to delete darta user');
      }
    }

  public async deleteDartaUserGalleryRelationship({uid, galleryId} : {uid: string, galleryId: string}): Promise<void> {
    const galleryUserId = this.galleryService.generateGalleryId({galleryId});
    const userId = this.generateDartaUserId({uid});
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
        const userId = this.generateDartaUserId({uid});
        const query = `
          WITH ${CollectionNames.Galleries}, ${CollectionNames.DartaUsers}, ${EdgeNames.FROMDartaUserTOGalleryFOLLOWS}
          FOR v, e IN 1..1 OUTBOUND @userId ${EdgeNames.FROMDartaUserTOGalleryFOLLOWS}
          RETURN {
            galleryName: v.galleryName,
            _id: v._id,
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
  public generateDartaUserId({uid}: {uid: string}): string {
    return uid.includes(CollectionNames.DartaUsers)
      ? uid
      : `${CollectionNames.DartaUsers}/${uid}`;
  }

  private async getUserProfilePicture({uid}: {uid: string}): Promise<any> {
    const key = this.generateDartaUserId({uid});
    const findGalleryKey = `
      LET doc = DOCUMENT(@key)
      RETURN doc.profilePicture
    `;

    try {
      const cursor = await this.db.query(findGalleryKey, {key});
      const exhibitionPrimaryImage: Images = await cursor.next();
      return exhibitionPrimaryImage;
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }

  async refreshUserProfileImage({
    uid,
    mainUrl,
    mediumUrl,
    smallUrl
  }: {
    uid: string;
    mainUrl: string;
    mediumUrl: string | null;
    smallUrl: string | null;
  }): Promise<void> {
    const userId = this.generateDartaUserId({uid});

    try {
      await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.DartaUsers,
        id: userId,
        data: {
          profilePicture: {
            value: mainUrl,
            mediumImage: {
              value: mediumUrl,
            },
            smallImage: {
              value: smallUrl,
            },
          },
        },
      });
    } catch (error) {
      throw new Error('unable refresh gallery profile logo');
    }
  }
  
  async incrementRouteGeneratedCount({uid}: {uid: string}): Promise<number> {
    const fullUserId = this.generateDartaUserId({uid});

    try {
      const user = await this.nodeService.getNodeById({
        collectionName: CollectionNames.DartaUsers,
        id: fullUserId,
      });

      if (user) {
        await this.nodeService.upsertNodeById({
          collectionName: CollectionNames.DartaUsers,
          id: fullUserId,
          data: {
            routeGenerationCount : {
              routeGeneratedCountWeekly: 
                user?.routeGenerationCount?.routeGeneratedCountWeekly  ? user.routeGenerationCount.routeGeneratedCountWeekly + 1 : 1,
              totalGeneratedCount: user?.routeGenerationCount?.totalGeneratedCount ? user.totalGeneratedCount + 1 : 1,
            }
          },
        });
        return user.routeGenerationCount.routeGeneratedCountWeekly + 1;
      } 
        throw new Error('user not found');
      
    } catch (error) {
      throw new Error('unable to increment route generated count');
    }
  }


  public async resetAllUsersRouteGenerationCount(): Promise<void> {
    const query = `
    WITH ${CollectionNames.DartaUsers}
    FOR user IN ${CollectionNames.DartaUsers}
    RETURN {
      userId: user._id,
    }`

    try {
      const cursor = await this.db.query(query);
      const users = await cursor.all();
      const promises = [];
      for (const user of users) {
        promises.push(this.resetRouteGeneratedCount({uid: user.userId}));
      }
      await Promise.allSettled(promises);
    }
    catch (error: any) {
      throw new Error(`Unable to reset all users route generation count ${error?.message}`);
    }
  }


  private async resetRouteGeneratedCount({uid}: {uid: string}): Promise<void> {
    const fullUserId = this.generateDartaUserId({uid});

    try {
      await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.DartaUsers,
        id: fullUserId,
        data: {
          routeGenerationCount : {
            routeGeneratedCountWeekly: 0
          }
        },
      });
    } catch (error) {
      throw new Error('unable to reset route generated count');
    }
  }
}
