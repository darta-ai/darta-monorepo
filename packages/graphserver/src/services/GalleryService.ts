/* eslint-disable no-await-in-loop */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  GalleryAddressFields,
  GalleryBase,
  GalleryForList,
  IGalleryProfileData,
  Images,
} from '@darta-types';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {CollectionNames, EdgeNames} from '../config/collections';
import { ENV } from '../config/config';
import {ImageController} from '../controllers/ImageController';
import { filterOutPrivateRecordsMultiObject } from '../middleware';
import {City, Gallery} from '../models/GalleryModel';
import {Node} from '../models/models';
import {IEdgeService, IGalleryService, INodeService} from './interfaces';
import { IEmailService } from './interfaces/IEmailService';


const BUCKET_NAME = 'logo';

@injectable()
export class GalleryService implements IGalleryService {
  constructor(
    @inject('ImageController') private readonly imageController: ImageController,
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IEmailService') private readonly emailService: IEmailService,
  ) {}

  public async createGalleryProfile({
    galleryName,
    isValidated,
    signUpWebsite,
    userEmail,
  }: any): Promise<any> {
    const galleryCollection = this.db.collection(
      `${CollectionNames.Galleries}`,
    );
    const newGallery: GalleryBase = {
      galleryName,
      isValidated,
      normalizedGalleryName: this.normalizeGalleryName({
        galleryName: galleryName?.value,
      }),
      normalizedGalleryWebsite: this.normalizeGalleryWebsite({signUpWebsite}),
      normalizedGalleryDomain: this.normalizeGalleryDomain({userEmail}),
    };

    try {
      const metaData = await galleryCollection.save(newGallery);
      await this.createGalleryAdminNode({
        galleryId: metaData?._id,
        email: userEmail,
      });
      try{
        await this.emailService.sgSendEmail({
          to: 'tj@darta.art',
          from: '',
          subject: 'New Gallery Signup',
          text: `Gallery Name: ${galleryName.value} \n Gallery Email: ${userEmail}. GalleryId: ${metaData?._id}`,
        })
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log({error})
      }
      return {
        ...newGallery,
        _id: metaData?._id,
        _key: metaData?._key,
        _rev: metaData?._rev,
      };
    } catch (error) {
      throw new Error('error creating gallery profile');
    }
  }

  public async readGalleryProfileFromUID(uid: string): Promise<Gallery | null> {
    try {
      const galleryId = await this.getGalleryIdFromUID({uid});
      const gallery = await this.readGalleryProfileFromGalleryId({galleryId});
      return gallery;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async readGalleryForList({artworkId} : {artworkId: string}): Promise<GalleryForList>{
    try {
      const galleryEdge = await this.edgeService.getEdgeWithTo({
        edgeName: EdgeNames.FROMGalleryToArtwork,
        to: artworkId,
      });

      if (!galleryEdge) {
        throw new Error('no gallery edge found')
      }

      const galleryId = galleryEdge._from;

      const gallery = await this.readGalleryProfileFromGalleryId({galleryId});

      if (!gallery) {
        throw new Error('no gallery found')
      }

      return {
        galleryLogo: gallery?.galleryLogo ?? null,
        galleryName: gallery?.galleryName ?? null,
        galleryId,
        primaryContact: gallery?.primaryContact ?? null,
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async readGalleryProfileFromGalleryId({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<Gallery | null> {
    const galleryQuery = `
    WITH ${CollectionNames.Galleries}
    FOR gallery IN ${CollectionNames.Galleries}
    FILTER gallery._id == @galleryId
    RETURN gallery
  `;

    let gallery;

    // get gallery
    try {
      const cursor = await this.db.query(galleryQuery, {galleryId});
      gallery = await cursor.next(); // Get the first result
    } catch (error: any) {
      throw new Error(error.message);
    }

    let galleryLogo;

    // get gallery image
    if (gallery?.galleryLogo) {
      ({galleryLogo} = gallery);
    }

    let shouldRegenerate;
    if (galleryLogo?.value) {
      shouldRegenerate = await this.imageController.shouldRegenerateUrl({url: galleryLogo.value})
    }

    let galleryLogoValueLarge = galleryLogo?.value ?? null;
    let galleryLogoValueMedium = galleryLogo?.mediumImage?.value ?? null;
    let galleryLogoValueSmall = galleryLogo?.smallImage?.value ?? null;

    if (shouldRegenerate && ENV === 'production' && galleryLogo?.bucketName && galleryLogo?.fileName) {
      try {
        galleryLogoValueLarge = await this.imageController.processGetFile({
          bucketName: galleryLogo?.bucketName,
          fileName: galleryLogo?.fileName,
        });
        if (galleryLogo.mediumImage?.fileName && galleryLogo.mediumImage?.bucketName){
          galleryLogoValueMedium = await this.imageController.processGetFile({
            fileName: galleryLogo.mediumImage?.fileName,
            bucketName: galleryLogo.mediumImage?.bucketName,
          });
        }
        if (galleryLogo.smallImage?.fileName && galleryLogo.smallImage?.bucketName){
          galleryLogoValueSmall = await this.imageController.processGetFile({
            fileName: galleryLogo.smallImage?.fileName,
            bucketName: galleryLogo.smallImage?.bucketName,
          });
        }
        await this.refreshGalleryProfileLogo({
          galleryId, 
          mainUrl: galleryLogoValueLarge,
          mediumUrl: galleryLogoValueMedium,
          smallUrl: galleryLogoValueSmall
        })
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error);
        galleryLogoValueLarge = '';
      }
    } else {
      galleryLogoValueLarge = galleryLogo?.value;
    }
    const results = {
      ...gallery,
      galleryLogo: {
        ...galleryLogo,
          value: galleryLogoValueLarge,
          mediumImage: {
            value: galleryLogoValueMedium
          },
          smallImage: {
            value: galleryLogoValueSmall
        },
      }
    };
    // await this.reSaveGalleryImageByGalleryId({id: results.galleryId})
    return results
  }

  public async readGalleryProfileFromGalleryIdForUser({galleryId} : {galleryId: string}): Promise<Gallery | null> {
    const fullGalleryId = this.generateGalleryId({galleryId});
    const gallery = await this.readGalleryProfileFromGalleryId({galleryId: fullGalleryId});
    if (!gallery) {
      return null;
    }
    return filterOutPrivateRecordsMultiObject(gallery) 
  }

  public async editGalleryProfile({
    user,
    data,
  }: {
    user: any;
    data: IGalleryProfileData;
  }): Promise<Gallery | null> {
    const {galleryLogo, ...galleryData} = data;

    const galleryId = await this.getGalleryIdFromUID({uid: user?.user_id});

    const {currentGalleryLogo} = await this.getGalleryLogo({id: galleryId});

    let fileName: string = crypto.randomUUID();
    if (currentGalleryLogo?.galleryLogo?.fileName) {
      fileName = currentGalleryLogo.galleryLogo.fileName;
    }

    let mediumImage = currentGalleryLogo?.galleryLogo
    let smallImage = currentGalleryLogo?.galleryLogo?.smallImage

    if (galleryLogo?.fileData) {
      try {
        const galleryLogoResults = await this.imageController.processUploadImage({
          fileBuffer: galleryLogo?.fileData,
          fileName,
          bucketName: BUCKET_NAME,
        });
        for (const result of galleryLogoResults) {
          if (result.size === 'mediumImage') mediumImage = result;
          else if (result.size === 'smallImage') smallImage = result;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log({error});
        // throw new Error('error uploading image');
      }
    }

    let gallery: any;
    try {
      gallery = await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.Galleries,
        id: galleryId,
        data: {
          ...galleryData,
          galleryLogo: {
            fileName: mediumImage?.fileName,
            bucketName: mediumImage?.bucketName,
            value: mediumImage?.value,
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
          },
        },
      });
    } catch (error) {
      throw new Error('unable to upsert node for gallery on edit');
    }

    if (gallery) {
      // Dynamically check for galleryLocationX properties
      for (let i = 0; i < 5; i+=1) {
        const key = `galleryLocation${i}`;
        if (gallery[key as keyof Gallery]) {
          const cityValue =
            gallery[key as keyof GalleryAddressFields] &&
            gallery[key as keyof GalleryAddressFields]?.locality?.value;
          if (cityValue) {
            // Check if city exists and upsert it
            const upsertCityQuery = `
            UPSERT { value: @cityValue }
            INSERT { value: @cityValue }
            UPDATE {} IN ${CollectionNames.Cities}
            RETURN NEW
          `;

            const cityCursor = await this.db.query(upsertCityQuery, {
              cityValue,
            });
            const city: City = await cityCursor.next(); // Assuming City is a type

            // Check if an edge between the gallery and this city already exists
            const checkEdgeQuery = `
            FOR edge IN ${EdgeNames.FROMGalleryToCity}
            FILTER edge._from == @galleryId AND edge._to == @cityId
            RETURN edge
            `;

            const edgeCursor = await this.db.query(checkEdgeQuery, {
              galleryId: gallery._id,
              cityId: city._id,
            });
            const existingEdge = await edgeCursor.next();

            // If there's no existing edge, create a new one
            if (!existingEdge) {
              const createEdgeQuery = `
                    INSERT { _from: @galleryId, _to: @cityId } INTO ${EdgeNames.FROMGalleryToCity}
                `;
              await this.db.query(createEdgeQuery, {
                galleryId: gallery._id,
                cityId: city._id,
              });
            }
          }
        }
      }
    }

    return gallery;
  }

  public async refreshGalleryProfileLogo({
    galleryId,
    mainUrl,
    mediumUrl,
    smallUrl
  }: {
    galleryId: string;
    mainUrl: string;
    mediumUrl: string | null;
    smallUrl: string | null;
  }): Promise<void> {
    const galId = this.generateGalleryId({galleryId});

    try {
      await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.Galleries,
        id: galId,
        data: {
          galleryLogo: {
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

  public async deleteGalleryProfile(): Promise<void> {
    await this.checkDuplicateGalleries({userEmail: 'Fake'});
  }

  public async verifyQualifyingGallery(email: string): Promise<boolean> {
    const isGmail = email.endsWith('@gmail.com');
    const domain = isGmail
      ? email
      : email.substring(email.lastIndexOf('@') + 1);
    try {
      // Define the query for checking the approved array
      const query = `
        FOR gallery IN ${CollectionNames.GalleryApprovals}
        FILTER @domain IN gallery.approved
        RETURN gallery
      `;
      const cursor = await this.db.query(query, {domain});
      const isValidated: boolean | null = await cursor.next(); // Get the first result
      if (isValidated) {
        return true;
      } 
        // Define the query for checking the awaiting approval array
        const query2 = `
          FOR gallery IN ${CollectionNames.GalleryApprovals}
          FILTER @domain IN gallery.${
            isGmail ? 'awaitingApprovalGmail' : 'awaitingApproval'
          }
          RETURN gallery
        `;
        const cursor2 = await this.db.query(query2, {domain});
        const isAwaiting: boolean | null = await cursor2.next(); // Get the first result
        if (isAwaiting) {
          return false;
        } 
          // Save the domain to the awaiting approval array
          const awaitingApprovalField = isGmail
            ? 'awaitingApprovalGmail'
            : 'awaitingApproval';
          const query3 = `
            FOR gallery IN ${CollectionNames.GalleryApprovals}
            UPDATE gallery WITH { ${awaitingApprovalField}: PUSH(gallery.${awaitingApprovalField}, @domain) } INTO ${CollectionNames.GalleryApprovals}
            RETURN NEW
          `;
          await this.db.query(query3, {domain});
          return false;
        
      
    } catch (error: any) {
      return false;
    }
  }

  public async getGalleryIdFromUID({uid}: {uid: string}): Promise<string> {
    const from = this.generateGalleryUserId({galleryId: uid});

    const galleryEdge = await this.edgeService.getEdgeWithFrom({
      edgeName: EdgeNames.FROMUserTOGallery,
      from,
    });
    const galleryId = galleryEdge._to;

    return galleryId;
  }

  public async getGalleryLogo({id}: {id: string}): Promise<any> {
    const findGalleryLogo = `
    LET doc = DOCUMENT(CONCAT("Galleries/", @id))
    RETURN {
        galleryLogo: doc.galleryLogo
    }
  `;
    const cursor = await this.db.query(findGalleryLogo, {id});

    const currentGalleryLogo: Images = await cursor.next();
    return {currentGalleryLogo};
  }

  public async checkDuplicateGalleries({
    userEmail,
  }: {
    userEmail: string;
  }): Promise<Node> {
    const normalizedGalleryDomain = this.normalizeGalleryDomain({userEmail});

    const checkGalleryDuplicates = `
      WITH ${CollectionNames.Galleries}
      FOR gallery in ${CollectionNames.Galleries}
      FILTER @normalizedGalleryDomain == gallery.normalizedGalleryDomain
      RETURN gallery
    `;

    try {
      const cursor = await this.db.query(checkGalleryDuplicates, {
        normalizedGalleryDomain,
      });
      const galleryExists: Node = await cursor.next();
      return galleryExists;
    } catch (error) {
      throw new Error('ahhhhh');
    }
  }


  public async getGalleryFromDomain({userEmail}: {userEmail: string}): Promise<Gallery | null>{
    const normalizedGalleryDomain = this.normalizeGalleryDomain({userEmail});

    const checkGalleryDuplicates = `
      WITH ${CollectionNames.Galleries}
      FOR gallery in ${CollectionNames.Galleries}
      FILTER @normalizedGalleryDomain == gallery.normalizedGalleryDomain
      RETURN gallery
    `;

    try {
      const cursor = await this.db.query(checkGalleryDuplicates, {
        normalizedGalleryDomain,
      });
      const galleryExists: Gallery = await cursor.next();
      return galleryExists;
    } catch (error) {
      throw new Error('ahhhhh');
    }
  }



  public async createGalleryAdminNode({
    galleryId,
    email,
  }: {
    galleryId: string;
    email: string;
  }): Promise<any> {
    // TO-DO: check if gallery admin node already exists
    const galleryIdId = this.generateGalleryUserId({galleryId});

    try {
      await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.GalleryAdminNode,
        id: galleryIdId,
        data: {
          approvedEmails: [email],
        },
      });
    } catch (error: any) {
      throw new Error('Unable to create gallery admin node');
    }
  }

  public async getGalleryByExhibitionId({exhibitionId}: {exhibitionId: string}): Promise<Gallery | null>{

    try {
      const results = await this.edgeService.getEdgeWithTo({
        edgeName: EdgeNames.FROMGalleryTOExhibition,
        to: exhibitionId,
      });
      return await this.readGalleryProfileFromGalleryId({galleryId: results._from})
    } catch(error: any){
      // console.log({error})
    }

    return null
  }

  public async readAllGalleries(): Promise<void>{ 
    const query = `
    FOR gallery IN ${CollectionNames.Galleries}
    RETURN {_id: gallery._id}
  `;
  
    const cursor = await this.db.query(query);
    const galleries = await cursor.all();

    const promises: Promise<any>[] = []

    galleries.forEach((gallery) => {
      if (!gallery?._id) return
      promises.push(this.readGalleryProfileFromGalleryId({galleryId: gallery._id}))
    })

    await Promise.allSettled(promises)
    }

  // eslint-disable-next-line class-methods-use-this
  public generateGalleryUserId({galleryId}: {galleryId: string}): string {
    return galleryId.includes(CollectionNames.GalleryUsers)
      ? galleryId
      : `${CollectionNames.GalleryUsers}/${galleryId}`;
  }

  // eslint-disable-next-line class-methods-use-this
  public generateGalleryId({galleryId}: {galleryId: string}): string {
    return galleryId.includes(CollectionNames.Galleries)
      ? galleryId
      : `${CollectionNames.Galleries}/${galleryId}`;
  }

  // eslint-disable-next-line class-methods-use-this
  private normalizeGalleryName({
    galleryName,
  }: {
    galleryName: string | null;
  }): string | null {
    if (!galleryName) {
      return null;
    }
    let normalized = galleryName.toLowerCase();
    normalized = normalized.trim();
    normalized = normalized.replace(/\s+/g, '-');
    normalized = normalized.replace(/[^a-z0-9-]/g, '');
    normalized = normalized.replace(/-+/g, '-');
    return normalized;
  }

  // eslint-disable-next-line class-methods-use-this
  private normalizeGalleryWebsite({
    signUpWebsite,
  }: {
    signUpWebsite: string | undefined;
  }): string | null {
    if (!signUpWebsite) {
      return null;
    }
    let normalized = signUpWebsite.toLowerCase();
    if (!/^https?:\/\//.test(normalized)) {
      normalized = `http://${normalized}`;
    }
    normalized = normalized.replace(/\/+$/, '');
    normalized = normalized.replace(/^https?:\/\/www\./, 'https://');
    normalized = decodeURIComponent(normalized);
    return normalized;
  }

  // eslint-disable-next-line class-methods-use-this
  private normalizeGalleryDomain({
    userEmail,
  }: {
    userEmail: string;
  }): string | null {
    if (!userEmail) {
      return null;
    }
    // Trim whitespace

    const domain = userEmail.split('@')[1];
    if (!domain) return null;

    let normalized = domain.trim();

    // Convert to lowercase
    normalized = normalized.toLowerCase();

    // Remove non-printable characters
    // eslint-disable-next-line no-control-regex
    normalized = normalized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

    return normalized;
  }
}
