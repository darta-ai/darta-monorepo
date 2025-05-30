/* eslint-disable no-return-assign */
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Artwork, 
  Exhibition, 
  ExhibitionForList, 
  ExhibitionMapPin, 
  ExhibitionObject, 
  ExhibitionPreview, 
  IBusinessLocationData, 
  IGalleryProfileData, 
  Images,
  MapPinCities} from '@darta-types';
import {Database} from 'arangojs';
import {Edge} from 'arangojs/documents';
import {inject, injectable} from 'inversify';
import _ from 'lodash';

import {CollectionNames, EdgeNames} from '../config/collections';
import { ENV } from '../config/config';
import { SEVEN_DAYS_AGO } from '../config/constants';
import {newExhibitionShell, standardConsoleLog} from '../config/templates';
import {ImageController} from '../controllers/ImageController';
import {
  filterOutPrivateRecordsMultiObject,
  filterOutPrivateRecordsSingleObject,
} from '../middleware';
import { City } from '../models/GalleryModel';
import {
  IArtworkService,
  IEdgeService,
  IExhibitionService,
  IGalleryService,
  INodeService,
  IUserService
} from './interfaces';

const BUCKET_NAME = 'exhibitions';
// const COMPRESSED_BUCKET_NAME = 'exhibitions-compressed';

@injectable()
export class ExhibitionService implements IExhibitionService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('IArtworkService') private readonly artworkService: IArtworkService,
    @inject('ImageController')
    private readonly imageController: ImageController,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
    @inject('IUserService') private readonly userService: IUserService
    ) {}

  public async createExhibition({
    galleryId,
    userId,
  }: {
    galleryId: string;
    userId: string;
  }): Promise<Exhibition | void> {
    if (!galleryId || !userId) {
      throw new Error('no gallery id or user id present');
    }

    const exhibition: Exhibition = _.cloneDeep(newExhibitionShell);
    exhibition.exhibitionId = crypto.randomUUID();
    exhibition.createdAt = new Date().toISOString();

    const exhibitionQuery = `
        INSERT @newExhibition INTO ${CollectionNames.Exhibitions} 
        RETURN NEW
      `;

    let newExhibition;

    try {
      const ExhibitionCursor = await this.db.query(exhibitionQuery, {
        newExhibition: {
          ...exhibition,
          _key: exhibition?.exhibitionId,
          value: exhibition?.slug?.value,
          galleryId,
        },
      });
      newExhibition = await ExhibitionCursor.next();
    } catch (error: any) {
      throw new Error(`Error creating exhibition: ${error.message}`);
    }

    try {
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMGalleryTOExhibition,
        from: `${galleryId}`,
        to: newExhibition._id,
        data: {value: 'created', createdAt: exhibition.createdAt},
      });
    } catch (error: any) {
      throw new Error(
        `Error creating exhibition to gallery edge: ${error.message}`,
      );
    }

    return newExhibition;
  }

  public async readExhibitionForGallery({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void> {
    return this.getExhibitionById({exhibitionId});
  }

  public async readGalleryExhibitionForUser({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void> {
    try{
    const results = await this.getExhibitionById({
      exhibitionId,
    });
    if (!results) {
      return;
    }
    const {artworks, ...exhibition} = results;

    const cleanedExhibition = filterOutPrivateRecordsSingleObject(exhibition);
    const cleanedArtworks = filterOutPrivateRecordsMultiObject(artworks);

    // eslint-disable-next-line consistent-return
    return {
      ...cleanedExhibition,
      artworks: {
        ...cleanedArtworks,
      },
    };
  } catch (error: any){
    throw new Error(error.message)
  }
  }

  public async readExhibitionForList({artworkId}: {artworkId: string}): Promise<ExhibitionForList>{
    try{
      const fullArtworkId = this.artworkService.generateArtworkId({artworkId})
      const artworkEdge = await this.edgeService.getEdgeWithTo({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        to: fullArtworkId
      })

      if (!artworkEdge){
        throw new Error('unable to find artwork edge')
      }
      const exhibitionId = artworkEdge._from
      const exhibition = await this.getExhibitionById({exhibitionId})

      let isCurrentlyShowing = false;
      if (exhibition?.exhibitionDates?.exhibitionStartDate?.value && exhibition?.exhibitionDates?.exhibitionEndDate?.value){
        isCurrentlyShowing = exhibition?.exhibitionDates?.exhibitionStartDate?.value <= new Date().toISOString() 
        && exhibition?.exhibitionDates?.exhibitionEndDate?.value >= new Date().toISOString()
      }

      return {
        exhibitionLocationString: exhibition?.exhibitionLocation?.locationString ?? null,
        exhibitionDates: exhibition?.exhibitionDates ?? null,
        exhibitionTitle: exhibition?.exhibitionTitle ?? null,
        exhibitionId: exhibition?.exhibitionId ?? null,
        exhibitionLocation: exhibition?.exhibitionLocation ?? null,
        isCurrentlyShowing
      }

    } catch (e: any){
      throw new Error(e.message)
    }
  }

  public async readMostRecentGalleryExhibitionForUser(
    {locationId} : {locationId: string}
    ): Promise<{exhibition: Exhibition, gallery : IGalleryProfileData} | void> {
    const date = new Date().toISOString()
    const mostRecentQuery = `
      FOR exhibition in ${CollectionNames.Exhibitions}
      FILTER exhibition.exhibitionLocation.googleMapsPlaceId.value == @locationId
      AND exhibition.exhibitionDates.exhibitionStartDate.value <= @date
      SORT exhibition.exhibitionDates.exhibitionEndDate.value DESC
      LIMIT 1
      RETURN exhibition._id
    `
    try{
      const exhibitionCursor = await this.db.query(mostRecentQuery, {locationId, date});
      const exhibitionId = await exhibitionCursor.next();

      const results = await this.getExhibitionById({
        exhibitionId,
      });
      if (!results) {
        return;
      }
      const {artworks, ...exhibition} = results;
      const cleanedExhibition = filterOutPrivateRecordsSingleObject(exhibition);
      const cleanedArtworks = filterOutPrivateRecordsMultiObject(artworks);

      const mostRecentGallery = await this.galleryService.getGalleryByExhibitionId({exhibitionId})
      const cleanedGallery = filterOutPrivateRecordsSingleObject(mostRecentGallery)
  
      // eslint-disable-next-line consistent-return
      return { 
        exhibition: {
        ...cleanedExhibition,
        artworks: {
          ...cleanedArtworks,
        },
      }, 
        gallery: {
          ...cleanedGallery
        }
    }
    } catch (error: any){
      throw new Error(error.message)
    }
  }

  public async getExhibitionById({
    exhibitionId
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void> {
    let exhibition: Exhibition = {} as Exhibition;
    try {
      const fullExhibitionId = this.generateExhibitionId({exhibitionId});
  
      const exhibitionQuery = `
        LET exhibition = DOCUMENT(@fullExhibitionId)
        RETURN exhibition      
        `;
  
      // LOL terrible as
     
      const cursor = await this.db.query(exhibitionQuery, {fullExhibitionId});
      exhibition = await cursor.next();
    } catch (error: any) {
      throw new Error(error.message);
    }

    const exhibitionArtworks = await this.listAllExhibitionArtworks({
      exhibitionId,
    });

    // REFRESH EXHIBITION PRE-SIGNED IMAGE
    

    let imageValue;

    let shouldRegenerate;
    if (exhibition?.exhibitionPrimaryImage?.value) {
      const shouldRegeneratePrimary = await this.imageController.shouldRegenerateUrl({url: exhibition?.exhibitionPrimaryImage.value})
      const shouldRegenerateMedium = exhibition?.exhibitionPrimaryImage?.mediumImage?.value 
        ? await this.imageController.shouldRegenerateUrl({url: exhibition?.exhibitionPrimaryImage?.mediumImage?.value}) : false;
      const shouldRegenerateSmall = exhibition?.exhibitionPrimaryImage?.smallImage?.value
        ? await this.imageController.shouldRegenerateUrl({url: exhibition?.exhibitionPrimaryImage?.smallImage?.value}) : false;
      shouldRegenerate = shouldRegeneratePrimary || shouldRegenerateMedium || shouldRegenerateSmall
    }
    let exhibitionImageValueLarge = exhibition.exhibitionPrimaryImage?.value ?? null;
    let exhibitionImageValueMedium = exhibition.exhibitionPrimaryImage?.mediumImage?.value ?? null
    let exhibitionImageValueSmall = exhibition.exhibitionPrimaryImage?.smallImage?.value ?? null

    if (shouldRegenerate && ENV === 'production' && exhibition?.exhibitionPrimaryImage?.fileName && exhibition?.exhibitionPrimaryImage?.bucketName) {
      const {fileName, bucketName} = exhibition.exhibitionPrimaryImage;
      exhibitionImageValueLarge = await this.imageController.processGetFile({
        fileName,
        bucketName,
      });
      if (exhibition?.exhibitionPrimaryImage?.mediumImage?.fileName && exhibition?.exhibitionPrimaryImage?.mediumImage?.bucketName) {
        const {fileName, bucketName} = exhibition.exhibitionPrimaryImage.mediumImage;
        exhibitionImageValueMedium = await this.imageController.processGetFile({
          fileName,
          bucketName,
        });
      }
      if (exhibition?.exhibitionPrimaryImage?.smallImage?.fileName && exhibition?.exhibitionPrimaryImage?.smallImage?.bucketName) {
        const {fileName, bucketName} = exhibition.exhibitionPrimaryImage.smallImage;
        exhibitionImageValueSmall = await this.imageController.processGetFile({
          fileName,
          bucketName,
        });
      }
      if (shouldRegenerate && ENV === 'production'){
        await this.refreshExhibitionHeroImage({exhibitionId, 
          mainUrl: exhibitionImageValueLarge, 
          mediumUrl: exhibitionImageValueMedium, 
          smallUrl: exhibitionImageValueSmall
        })
        standardConsoleLog({request: 'ExhibitionService', data: 'getExhibitionId', message: 'should regenerate imageUrl'})

      }
      exhibition.exhibitionPrimaryImage.value = imageValue;
    } else {
      imageValue = exhibition?.exhibitionPrimaryImage?.value
    }

    return {
      ...exhibition,
      exhibitionPrimaryImage: {
        bucketName : exhibition?.exhibitionPrimaryImage?.bucketName,
        value: exhibitionImageValueLarge,
        fileName: exhibition?.exhibitionPrimaryImage?.fileName,
        mediumImage: {
          value: exhibitionImageValueMedium
        },
        smallImage: {
          value: exhibitionImageValueSmall
        }
      },
      artworks: {
        ...exhibitionArtworks,
      },
    };
  }

  public async getExhibitionAndLikesById({
    exhibitionId
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void> {
    let exhibition: Exhibition = {} as Exhibition;
    try {
      const fullExhibitionId = this.generateExhibitionId({exhibitionId});
  
      const exhibitionQuery = `
        LET exhibition = DOCUMENT(@fullExhibitionId)
        RETURN exhibition      
        `;
  
      // LOL terrible as
     
      const cursor = await this.db.query(exhibitionQuery, {fullExhibitionId});
      exhibition = await cursor.next();
    } catch (error: any) {
      throw new Error(error.message);
    }

    const exhibitionArtworks = await this.listAllExhibitionArtworks({
      exhibitionId,
    });

    // REFRESH EXHIBITION PRE-SIGNED IMAGE
    

    let imageValue;

    let shouldRegenerate;
    if (exhibition?.exhibitionPrimaryImage?.value) {
      shouldRegenerate = await this.imageController.shouldRegenerateUrl({url: exhibition?.exhibitionPrimaryImage.value})
    }
    let exhibitionImageValueLarge = exhibition.exhibitionPrimaryImage?.value ?? null;
    let exhibitionImageValueMedium = exhibition.exhibitionPrimaryImage?.mediumImage?.value ?? null
    let exhibitionImageValueSmall = exhibition.exhibitionPrimaryImage?.smallImage?.value ?? null

    if (shouldRegenerate && ENV === 'production' && exhibition?.exhibitionPrimaryImage?.fileName && exhibition?.exhibitionPrimaryImage?.bucketName) {
      const {fileName, bucketName} = exhibition.exhibitionPrimaryImage;
      exhibitionImageValueLarge = await this.imageController.processGetFile({
        fileName,
        bucketName,
      });
      if (exhibition?.exhibitionPrimaryImage?.mediumImage?.fileName && exhibition?.exhibitionPrimaryImage?.mediumImage?.bucketName) {
        const {fileName, bucketName} = exhibition.exhibitionPrimaryImage.mediumImage;
        exhibitionImageValueMedium = await this.imageController.processGetFile({
          fileName,
          bucketName,
        });
      }
      if (exhibition?.exhibitionPrimaryImage?.smallImage?.fileName && exhibition?.exhibitionPrimaryImage?.smallImage?.bucketName) {
        const {fileName, bucketName} = exhibition.exhibitionPrimaryImage.smallImage;
        exhibitionImageValueSmall = await this.imageController.processGetFile({
          fileName,
          bucketName,
        });
      }
      if (ENV === 'production'){
        await this.refreshExhibitionHeroImage({exhibitionId, 
          mainUrl: exhibitionImageValueLarge, 
          mediumUrl: exhibitionImageValueMedium, 
          smallUrl: exhibitionImageValueSmall
        })
        standardConsoleLog({request: 'ExhibitionService', data: 'getExhibitionId', message: 'should regenerate imageUrl'})

      }
      exhibition.exhibitionPrimaryImage.value = imageValue;
    } else {
      imageValue = exhibition?.exhibitionPrimaryImage?.value
    }

    return {
      ...exhibition,
      exhibitionPrimaryImage: {
        bucketName : exhibition?.exhibitionPrimaryImage?.bucketName,
        value: exhibitionImageValueLarge,
        fileName: exhibition?.exhibitionPrimaryImage?.fileName,
        mediumImage: {
          value: exhibitionImageValueMedium
        },
        smallImage: {
          value: exhibitionImageValueSmall
        }
      },
      artworks: {
        ...exhibitionArtworks,
      },
    };
  }

  public async getExhibitionPreviewById({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const exhibitionQuery = `
      LET exhibition = DOCUMENT(@fullExhibitionId)
      RETURN {
        exhibitionTitle: exhibition.exhibitionTitle,
        exhibitionPrimaryImage: exhibition.exhibitionPrimaryImage,
        exhibitionLocation: exhibition.exhibitionLocation,
        exhibitionArtist: exhibition.exhibitionArtist,
        exhibitionId: exhibition.exhibitionId,
        exhibitionDates: exhibition.exhibitionDates,
        createdAt: exhibition.createdAt,
        _id: exhibition._id,
      }      
      `;

    // LOL terrible as
    let exhibition: Exhibition = {} as Exhibition;
    try {
      const cursor = await this.db.query(exhibitionQuery, {fullExhibitionId});
      exhibition = await cursor.next();
    } catch (error: any) {
      throw new Error(error.message);
    }


    return {
      ...exhibition,
    };
  }


  public async editExhibition({
    exhibition,
  }: {
    exhibition: Exhibition;
  }): Promise<Exhibition | void> {
    const exhibitionId = exhibition?.exhibitionId;
    if (!exhibitionId) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {artworks, exhibitionPrimaryImage, exhibitionLocation, ...remainingExhibitionProps} =
      exhibition;

    // #########################################################################
    //                             SAVE THE EXHIBITION IMAGE
    // #########################################################################

    const exhibitionImage = await this.getExhibitionImage({
      key: exhibitionId,
    });

    // Don't overwrite an image
    let fileName: string = crypto.randomUUID();
    if (exhibitionImage?.exhibitionPrimaryImage?.fileName) {
      fileName = exhibitionImage.exhibitionPrimaryImage.fileName;
    }


    let largeImage = exhibitionPrimaryImage
    let mediumImage = exhibitionPrimaryImage?.mediumImage
    let smallImage = exhibitionPrimaryImage?.smallImage

    if (exhibitionPrimaryImage?.fileData) {
      try {
        const artworkImageResults =
        await this.imageController.processUploadImage({
          fileBuffer: exhibitionPrimaryImage?.fileData,
          fileName,
          bucketName: BUCKET_NAME,
        });

        for (const result of artworkImageResults) {
          if (result.size === 'largeImage') largeImage = result;
          else if (result.size === 'mediumImage') mediumImage = result;
          else if (result.size === 'smallImage') smallImage = result;
        }

      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('error uploading image:', error);
      }
    }

    // #########################################################################
    //                              SAVE THE EXHIBITION
    //                        Not including the bucketed stuff
    // #########################################################################

    const data = {
      ...remainingExhibitionProps,
      exhibitionLocation: {...exhibitionLocation},
      exhibitionPrimaryImage: {
        bucketName: largeImage?.bucketName,
        value: largeImage?.value,
        fileName: largeImage?.fileName,
        mediumImage: {
          bucketName: mediumImage?.bucketName,
          value: mediumImage?.value,
          fileName: mediumImage?.fileName,
        },
        smallImage: {
          bucketName: mediumImage?.bucketName,
          value: smallImage?.value,
          fileName: smallImage?.fileName,
        },
      },
      updatedAt: new Date(),
    };

    let savedExhibition;

    try {
      savedExhibition = await this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.Exhibitions,
        key: exhibitionId,
        data,
      });
    } catch (error) {
      throw new Error('error saving exhibition');
    }

    // #########################################################################
    //                             SAVE THE EXHIBITION LOCATION EDGE
    // #########################################################################

    try{


    let cityName = ""

    if(exhibitionLocation?.locality?.value){
      cityName = exhibitionLocation.locality.value
    }

    if (cityName) {
      // Check if city exists and upsert it
      const upsertCityQuery = `
      UPSERT { value: @cityName }
      INSERT { value: @cityName }
      UPDATE {} IN ${CollectionNames.Cities}
      RETURN NEW
    `;

      const cityCursor = await this.db.query(upsertCityQuery, {
        cityName,
      });
      const city: City = await cityCursor.next(); // Assuming City is a type

      // Check if an edge between the exhibition and this city already exists
      const checkEdgeQuery = `
      FOR edge IN ${EdgeNames.FROMExhibitionTOCity}
      FILTER edge._from == @exhibitionId AND edge._to == @cityId
      RETURN edge
      `;

      const edgeCursor = await this.db.query(checkEdgeQuery, {
        exhibitionId: savedExhibition._id,
        cityId: city._id,
      });
      const existingEdge = await edgeCursor.next();

      // If there's no existing edge, create a new one
      if (!existingEdge && city._id) {
        await this.edgeService.upsertEdge({
          edgeName: EdgeNames.FROMExhibitionTOCity,
          from: savedExhibition._id,
          to: city._id,
          data: {
            value: 'SHOWING'
          }
        })
      }
    }
  } catch(error:any){
    throw new Error('unable to add edge from exhibition to city')
  }

    const returnExhibition: any = {
      ...savedExhibition,
    };

    // eslint-disable-next-line consistent-return
    return returnExhibition;
  }


  // eslint-disable-next-line consistent-return
  public async publishExhibition({
    exhibitionId, 
    isPublished
    } : {
      exhibitionId: string, 
      isPublished: boolean}): Promise<Exhibition | void>{
    try{

      const exId = this.generateExhibitionId({exhibitionId})
      // const verifyGalleryOwnsExhibition = await this.verifyGalleryOwnsExhibition({exhibitionId, galleryId})
      // if (!verifyGalleryOwnsExhibition){
      //   throw new Error('unable to verify gallery owns exhibition')
      // }

      const exhibition = await this.getExhibitionById({exhibitionId: exId})
      if (!exhibition){
        throw new Error('unable to find exhibition')
      }

      const {artworks, ...remainingExhibitionProps} = exhibition;

      // #########################################################################
      //                              adjust the artwork 
    
      let artworkResults = artworks

      if (artworks){
        const promises: Promise<any>[] = []

        Object.values(artworks).forEach((artwork: Artwork) => {
          promises.push(this.artworkService.editArtwork({artwork: {...artwork, published: isPublished}}))
        })
        try{
          const res = await Promise.all(promises)
          artworkResults = res.reduce((acc, obj) => ({...acc, [obj._id]: obj}), {})
        } catch(error: any){
          throw new Error(`error publishing artworks: ${error.message}`)
        }
      }

      const savedExhibition = await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.Exhibitions,
        id: exId,
        data: {...remainingExhibitionProps, published: isPublished}
      });

      if (exhibition){
        return {
          ...savedExhibition,
          artworks: {
            ...artworkResults
          }
        } as Exhibition
      }
    } catch (error: any){
      throw new Error(`error publishing exhibition: ${error.message}`)
    }
  }

  public async refreshExhibitionHeroImage({
    exhibitionId,
    mainUrl,
    mediumUrl,
    smallUrl
  }: {
    exhibitionId: string;
    mainUrl: string;
    mediumUrl: string | null;
    smallUrl: string | null;
  }): Promise<void>  {
    const exhibitId = this.generateExhibitionId({exhibitionId});

    try {
      await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.Exhibitions,
        id: exhibitId,
        data: {
          exhibitionPrimaryImage: {
            value: mainUrl,
            mediumImage: {
              value: mediumUrl
            },
            smallImage: {
              value: smallUrl
            }
          },
        },
      });
    } catch (error) {
      throw new Error('unable to refresh exhibition hero image');
    }
  }


  public async deleteExhibition({
    exhibitionId,
    galleryId,
    deleteArtworks,
  }: {
    exhibitionId: string;
    galleryId: string;
    deleteArtworks?: boolean;
  }): Promise<boolean> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const fullGalleryId = this.galleryService.generateGalleryId({galleryId});

    const isVerified = await this.verifyGalleryOwnsExhibition({
      exhibitionId,
      galleryId,
    });
    if (!isVerified) {
      throw new Error('unable to verify exhibition is owned by gallery');
    }

    const exhibition = await this.getExhibitionById({exhibitionId});
    let artworks: {[key: string]: Artwork} = {};

    if (exhibition?.artworks) {
      artworks = exhibition.artworks as {[key: string]: Artwork};
    }

    const promises = [];

    // Handle artworks
    if (artworks) {
      const artworkArray = Object.values(artworks);

      artworkArray.forEach(artwork => {
        // Delete artwork if required
        if (deleteArtworks && artwork?.artworkId) {
          promises.push(
            this.artworkService.deleteArtwork({artworkId: artwork.artworkId}),
            this.deleteExhibitionToArtworkEdge({exhibitionId, artworkId: artwork.artworkId})
          );
        }

        // Delete exhibition to artwork edge
        promises.push(
          this.edgeService.deleteEdge({
            edgeName: EdgeNames.FROMGalleryTOExhibition,
            from: fullGalleryId,
            to: fullExhibitionId,
          }),
        );
      });
    }

    // Delete exhibition image
    if (
      exhibition?.exhibitionPrimaryImage?.fileName &&
      exhibition?.exhibitionPrimaryImage?.bucketName
    ) {
      const {fileName, bucketName} = exhibition.exhibitionPrimaryImage;
      promises.push(
        this.imageController.processDeleteImage({fileName, bucketName}),
      );
    }

    // Delete gallery to Exhibition edge
    promises.push(
      this.edgeService
        .deleteEdge({
          edgeName: EdgeNames.FROMGalleryTOExhibition,
          from: fullGalleryId,
          to: fullExhibitionId,
        })
        .catch(() => {
          throw new Error('unable to delete edge');
        }),
    ); // Catch here to allow other promises to complete

    // Delete exhibition
    promises.push(
      this.nodeService
        .deleteNode({
          collectionName: CollectionNames.Exhibitions,
          id: fullExhibitionId,
        })
        .catch(() => {
          throw new Error('unable to delete node');
        }),
    ); // Catch here to allow other promises to complete

    // Wait for all promises to complete
    let results;
    try {
      results = await Promise.allSettled(promises);
      results.filter((result: any) => result.status !== 'rejected');
    } catch (error: any) {
      throw new Error(`unable to delete a node: ${error.message}`);
    }

    if (results) {
      return true;
    }

    return false;

    // You can further handle results if needed (e.g., check for errors)
  }

  public async listExhibitionForGallery({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<Exhibition[] | void> {
    const getExhibitionsQuery = `
      WITH ${CollectionNames.Galleries}, ${CollectionNames.Exhibitions}
      FOR artwork IN OUTBOUND @galleryId ${EdgeNames.FROMGalleryTOExhibition}
      RETURN artwork._id      
    `;

    try {
      const edgeCursor = await this.db.query(getExhibitionsQuery, {galleryId});
      const exhibitionIds = (await edgeCursor.all()).filter(el => el);

      const galleryOwnedArtworkPromises = exhibitionIds.map(
        async (exhibitionId: string) => this.getExhibitionAndLikesById({exhibitionId}),
      );

      const galleryExhibitions = await Promise.all(galleryOwnedArtworkPromises);
      if (galleryExhibitions) {
        return galleryExhibitions as Exhibition[];
      }
      throw new Error('unable to find galleryExhibitions')
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async listGalleryExhibitionsForUser({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<ExhibitionObject | void>{
    const getExhibitionsQuery = `
    WITH ${CollectionNames.Galleries}, ${CollectionNames.Exhibitions}
    FOR exhibition IN OUTBOUND @galleryId ${EdgeNames.FROMGalleryTOExhibition}
    RETURN exhibition._id      
  `;

  try {
    const edgeCursor = await this.db.query(getExhibitionsQuery, {galleryId});
    const exhibitionIds = (await edgeCursor.all()).filter(el => el);

    const galleryOwnedArtworkPromises = exhibitionIds.map(
      async (exhibitionId: string) => {
        const results = await this.getExhibitionById({exhibitionId});
        return filterOutPrivateRecordsMultiObject(results)
      },
    );

    const galleryExhibitions = await Promise.all(galleryOwnedArtworkPromises);
    const galleryExhibitionsObject = galleryExhibitions.reduce((acc, obj) => acc[obj.exhibitionId as string] = obj, {})
    if (galleryExhibitions) {
      return galleryExhibitionsObject as ExhibitionObject;
    }
    throw new Error('unable to find gallery Exhibitions')
  } catch (error: any) {
    throw new Error(error.message);
  }
}

  public async listGalleryExhibitionPreviewsForUser({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<ExhibitionObject | null> {
    const galId = this.galleryService.generateGalleryId({galleryId})
    const getExhibitionsQuery = `
    WITH ${CollectionNames.Galleries}, ${CollectionNames.Exhibitions}
    FOR exhibition IN OUTBOUND @galleryId ${EdgeNames.FROMGalleryTOExhibition}
    FILTER exhibition.published == true
    RETURN exhibition._id      
  `;

  try {
    const edgeCursor = await this.db.query(getExhibitionsQuery, {galleryId: galId});
    const exhibitionIds = (await edgeCursor.all()).filter(el => el);

    const galleryOwnedArtworkPromises = exhibitionIds.map(
      async (exhibitionId: string) => {
        const results = await this.getExhibitionPreviewById({exhibitionId});
        return filterOutPrivateRecordsMultiObject(results)
      },
    );

    const galleryExhibitions = await Promise.all(galleryOwnedArtworkPromises);
    const galleryExhibitionsObject = galleryExhibitions.reduce((acc, obj) =>{ 
      acc[obj.exhibitionId as string] = obj 
      return acc}, 
      {})
    if (galleryExhibitions) {
      return galleryExhibitionsObject;
    } 
      return null
  } catch (error: any) {
    throw new Error(error.message);
  }
  }

  public async listExhibitionsPreviewsForUserByLimit({limit}: {limit: number}): Promise<{[key: string]: ExhibitionPreview} | void> {
 
    const getExhibitionPreviewQuery = `
    WITH ${CollectionNames.Exhibitions}, ${CollectionNames.Galleries}, ${CollectionNames.Artwork}
    LET exhibitions = (
      FOR exhibition IN ${CollectionNames.Exhibitions}
      SORT exhibition.exhibitionDates.exhibitionStartDate.value DESC
      FILTER exhibition.published == true
      LIMIT 0, @limit
      RETURN exhibition
    )
    
    FOR exhibition IN exhibitions
        LET gallery = (
            FOR g, edge IN 1..1 INBOUND exhibition ${EdgeNames.FROMGalleryTOExhibition}
                RETURN g
        )[0]
        LET artworks = (
            FOR artwork, artworkEdge IN 1..1 OUTBOUND exhibition ${EdgeNames.FROMCollectionTOArtwork}
            SORT artworkEdge.exhibitionOrder ASC
            LIMIT 10
            RETURN {
                [artwork._id]: {
                    _id: artwork._id,
                    artworkImage: artwork.artworkImage,
                    artworkTitle: artwork.artworkTitle
                }
            }
        )
        
    RETURN {
        artworkPreviews: artworks,
        exhibitionId: exhibition._id,
        galleryId: gallery._id,
        exhibitionDuration: exhibition.exhibitionDates,
        openingDate: {value: exhibition.exhibitionDates.exhibitionStartDate.value},
        closingDate: {value: exhibition.exhibitionDates.exhibitionEndDate.value},
        galleryLogo: gallery.galleryLogo,
        galleryName: gallery.galleryName,
        exhibitionTitle: exhibition.exhibitionTitle,
        exhibitionArtist: exhibition.exhibitionArtist,
        exhibitionLocation: {
            exhibitionLocationString: exhibition.exhibitionLocation.locationString,
            coordinates: exhibition.exhibitionLocation.coordinates
        },
        exhibitionPrimaryImage: exhibition.exhibitionPrimaryImage,
        receptionDates: exhibition.receptionDates
    }
    `
  
    try {
      const edgeCursor = await this.db.query(getExhibitionPreviewQuery, { limit });
      const exhibitionPreviews = (await edgeCursor.all()).filter((el) => el && Object?.values(el.artworkPreviews)?.length > 0);

      return exhibitionPreviews.reduce((acc, obj) =>{
        acc[obj.exhibitionId as string] = {...obj, artworkPreviews: obj.artworkPreviews.reduce((acc2 : any, obj2: any) => ({...acc2, ...obj2}), {})}
        return acc}, {})
  
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async listExhibitionsPreviewsCurrentForUserByLimit({limit, uid}: {limit: number, uid: string})
  : Promise<{[key: string]: ExhibitionPreview} | void> {
    const getExhibitionPreviewQuery = `
    WITH ${CollectionNames.Exhibitions}, ${CollectionNames.Galleries}, ${CollectionNames.Artwork}
    LET exhibitions = (
      FOR exhibition IN ${CollectionNames.Exhibitions}
      SORT exhibition.exhibitionDates.exhibitionStartDate.value DESC
      FILTER exhibition.published == true 
      AND exhibition.exhibitionDates.exhibitionStartDate.value <= DATE_ISO8601(DATE_NOW()) 
      AND exhibition.exhibitionDates.exhibitionEndDate.value >= DATE_ISO8601(DATE_NOW())
      LIMIT 0, @limit
      RETURN exhibition
    )
    
    FOR exhibition IN exhibitions
        LET gallery = (
            FOR g, edge IN 1..1 INBOUND exhibition ${EdgeNames.FROMGalleryTOExhibition}
                RETURN g
        )[0]
        LET artworks = (
            FOR artwork, artworkEdge IN 1..1 OUTBOUND exhibition ${EdgeNames.FROMCollectionTOArtwork}
            SORT artworkEdge.exhibitionOrder ASC
            LIMIT 5
            RETURN {
                [artwork._id]: {
                    _id: artwork._id,
                    artworkImage: artwork.artworkImage,
                    artworkTitle: artwork.artworkTitle
                }
            }
        )
        
    RETURN {
        artworkPreviews: artworks,
        exhibitionId: exhibition._id,
        galleryId: gallery._id,
        exhibitionDuration: exhibition.exhibitionDates,
        openingDate: {value: exhibition.exhibitionDates.exhibitionStartDate.value},
        closingDate: {value: exhibition.exhibitionDates.exhibitionEndDate.value},
        galleryLogo: gallery.galleryLogo,
        galleryName: gallery.galleryName,
        exhibitionTitle: exhibition.exhibitionTitle,
        exhibitionArtist: exhibition.exhibitionArtist,
        exhibitionLocation: {
            exhibitionLocationString: exhibition.exhibitionLocation.locationString,
            coordinates: exhibition.exhibitionLocation.coordinates
        },
        exhibitionPrimaryImage: {
            value: exhibition.exhibitionPrimaryImage.value
        },
        receptionDates: exhibition.receptionDates
    }
    `
  
    try {
      const edgeCursor = await this.db.query(getExhibitionPreviewQuery, { limit });
      const exhibitionPreviews = await edgeCursor.all()
      
      let seenResults: {[key: string]: boolean} = {}
      if (uid){
        const previewsPromises: any = []
        exhibitionPreviews.forEach((exhibition: any) => {
          previewsPromises.push(this.getUserViewedExhibition({exhibitionId: exhibition.exhibitionId, uid}))
        });
        const results = await Promise.allSettled(previewsPromises);
          results.forEach((result) => {
              if (result.status === 'fulfilled') {
                  seenResults = { ...seenResults, ...result.value };
              }
          });
      }
      
      return exhibitionPreviews.reduce((acc, obj) =>{
        acc[obj.exhibitionId as string] = {...obj, 
          userViewed: seenResults?.[obj?.exhibitionId] ?? true, 
          artworkPreviews: obj.artworkPreviews.reduce((acc2 : any, obj2: any) => ({...acc2, ...obj2 }), {})}
        return acc}, {})
  
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async listExhibitionsPreviewsForthcomingForUserByLimit({limit, uid}: {limit: number, uid: string | null})
  : Promise<{[key: string]: ExhibitionPreview} | void> {
    
    const getExhibitionPreviewQuery = `
    WITH ${CollectionNames.Exhibitions}, ${CollectionNames.Galleries}, ${CollectionNames.Artwork}
    LET exhibitions = (
      FOR exhibition IN ${CollectionNames.Exhibitions}
      SORT exhibition.exhibitionDates.exhibitionStartDate.value DESC
      FILTER exhibition.published == true AND exhibition.exhibitionDates.exhibitionStartDate.value > DATE_ISO8601(DATE_NOW())
      LIMIT 0, @limit
      RETURN exhibition
    )
    
    FOR exhibition IN exhibitions
        LET gallery = (
            FOR g, edge IN 1..1 INBOUND exhibition ${EdgeNames.FROMGalleryTOExhibition}
                RETURN g
        )[0]
        LET artworks = (
            FOR artwork, artworkEdge IN 1..1 OUTBOUND exhibition ${EdgeNames.FROMCollectionTOArtwork}
            SORT artworkEdge.exhibitionOrder ASC
            LIMIT 5
            RETURN {
                [artwork._id]: {
                    _id: artwork._id,
                    artworkImage: artwork.artworkImage,
                    artworkTitle: artwork.artworkTitle
                }
            }
        )
        
    RETURN {
        artworkPreviews: artworks,
        exhibitionId: exhibition._id,
        galleryId: gallery._id,
        exhibitionDuration: exhibition.exhibitionDates,
        openingDate: {value: exhibition.exhibitionDates.exhibitionStartDate.value},
        closingDate: {value: exhibition.exhibitionDates.exhibitionEndDate.value},
        galleryLogo: gallery.galleryLogo,
        galleryName: gallery.galleryName,
        exhibitionTitle: exhibition.exhibitionTitle,
        exhibitionArtist: exhibition.exhibitionArtist,
        exhibitionLocation: {
            exhibitionLocationString: exhibition.exhibitionLocation.locationString,
            coordinates: exhibition.exhibitionLocation.coordinates
        },
        exhibitionPrimaryImage: {
            value: exhibition.exhibitionPrimaryImage.value
        },
        receptionDates: exhibition.receptionDates
    }
    `
  
    try {
      const edgeCursor = await this.db.query(getExhibitionPreviewQuery, { limit });
      const exhibitionPreviews = await edgeCursor.all()

      let seenResults: {[key: string]: boolean} = {}
      if (uid){
        const previewsPromises: any = []
        exhibitionPreviews.forEach((exhibition: any) => {
          previewsPromises.push(this.getUserViewedExhibition({exhibitionId: exhibition.exhibitionId, uid}))
        });
        const results = await Promise.allSettled(previewsPromises);
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                seenResults = { ...seenResults, ...result.value };
            }
        });
      }

      const results = exhibitionPreviews.reduce((acc, obj) => 
      {
        const userViewed = (seenResults?.[obj?.exhibitionId] || new Date(obj?.openingDate.value).toISOString() < SEVEN_DAYS_AGO ) ?? true
        acc[obj.exhibitionId as string] = {
          ...obj, 
          userViewed, 
          artworkPreviews: obj.artworkPreviews.reduce((acc2 : any, obj2: any) => ({...acc2, ...obj2 }), {})}
        return acc 
      }, {})

      return results;
  
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async listExhibitionsPreviewsUserFollowingForUserByLimit(
    {limit, uid} : {limit: number, uid: string | null}): Promise<{[key: string]: ExhibitionPreview} | void> {
      if (!uid){
        throw new Error('uid is required')
      }
      const userId = this.userService.generateDartaUserId({uid})
      const getExhibitionPreviewQuery = `
      WITH ${CollectionNames.Exhibitions}, ${CollectionNames.Galleries}, ${CollectionNames.Artwork}, ${CollectionNames.DartaUsers}
      LET followedGalleries = (
        FOR v, e IN 1..1 OUTBOUND @userId ${EdgeNames.FROMDartaUserTOGalleryFOLLOWS}
          RETURN v._id
      )
      LET exhibitions = (
        FOR exhibition IN ${CollectionNames.Exhibitions}
        FILTER exhibition.published == true AND LENGTH(
          FOR g, edge IN 1..1 INBOUND exhibition ${EdgeNames.FROMGalleryTOExhibition}
            FILTER g._id IN followedGalleries
            RETURN g
        ) > 0 AND exhibition.exhibitionDates.exhibitionStartDate.value <= DATE_ISO8601(DATE_NOW())
        SORT exhibition.exhibitionDates.exhibitionStartDate.value DESC
        LIMIT 0, @limit
        RETURN exhibition
      )
      
      FOR exhibition IN exhibitions
          LET gallery = (
              FOR g, edge IN 1..1 INBOUND exhibition ${EdgeNames.FROMGalleryTOExhibition}
                  RETURN g
          )[0]
          LET artworks = (
              FOR artwork, artworkEdge IN 1..1 OUTBOUND exhibition ${EdgeNames.FROMCollectionTOArtwork}
              SORT artworkEdge.exhibitionOrder ASC
              LIMIT 5
              RETURN {
                  [artwork._id]: {
                      _id: artwork._id,
                      artworkImage: artwork.artworkImage,
                      artworkTitle: artwork.artworkTitle
                  }
              }
          )
          
      RETURN {
          artworkPreviews: artworks,
          exhibitionId: exhibition._id,
          galleryId: gallery._id,
          exhibitionDuration: exhibition.exhibitionDates,
          openingDate: {value: exhibition.exhibitionDates.exhibitionStartDate.value},
          closingDate: {value: exhibition.exhibitionDates.exhibitionEndDate.value},
          galleryLogo: gallery.galleryLogo,
          galleryName: gallery.galleryName,
          exhibitionTitle: exhibition.exhibitionTitle,
          exhibitionArtist: exhibition.exhibitionArtist,
          exhibitionLocation: {
              exhibitionLocationString: exhibition.exhibitionLocation.locationString,
              coordinates: exhibition.exhibitionLocation.coordinates
          },
          exhibitionPrimaryImage: {
              value: exhibition.exhibitionPrimaryImage.value
          },
          receptionDates: exhibition.receptionDates
      }
    `;
    
  
    try {
      const edgeCursor = await this.db.query(getExhibitionPreviewQuery, { limit, userId});
      const exhibitionPreviews = (await edgeCursor.all());


      let seenResults: {[key: string]: boolean} = {}
      if (uid){
        const previewsPromises: any = []
        exhibitionPreviews.forEach((exhibition: any) => {
          previewsPromises.push(this.getUserViewedExhibition({exhibitionId: exhibition.exhibitionId, uid}))
        });
        const results = await Promise.allSettled(previewsPromises);
          results.forEach((result) => {
              if (result.status === 'fulfilled') {
                  seenResults = { ...seenResults, ...result.value };
              }
          });
      }

      return exhibitionPreviews.reduce((acc, obj) => 
      {
        const userViewed = (seenResults?.[obj?.exhibitionId] || new Date(obj?.openingDate.value).toISOString() < SEVEN_DAYS_AGO ) ?? true
        acc[obj.exhibitionId as string] = {
          ...obj, 
          userViewed, 
          artworkPreviews: obj.artworkPreviews.reduce((acc2 : any, obj2: any) => ({...acc2, ...obj2 }), {})}
        return acc 
      }, {})

    } catch (error: any) {
      throw new Error(error.message);
    }
  }


  public async listExhibitionsPreviewsForthcomingGalleryFollowingForUserByLimit({limit, uid}: {limit: number, uid: string | null})
  : Promise<{[key: string]: ExhibitionPreview} | void> {
    
    const getExhibitionPreviewQuery = `
    WITH ${CollectionNames.Exhibitions}, ${CollectionNames.Galleries}, ${CollectionNames.Artwork}, ${CollectionNames.DartaUsers}
    LET followedGalleries = (
        FOR v, e IN 1..1 OUTBOUND @uid ${EdgeNames.FROMDartaUserTOGalleryFOLLOWS}
        RETURN v._id
    )
    
    FOR exhibition IN ${CollectionNames.Exhibitions}
        FILTER exhibition.published == true AND exhibition.exhibitionDates.exhibitionStartDate.value > DATE_ISO8601(DATE_NOW())
        
        LET gallery = (
            FOR g, edge IN 1..1 INBOUND exhibition ${EdgeNames.FROMGalleryTOExhibition}
            FILTER g._id IN followedGalleries
            RETURN g
        )[0]
        
        FILTER gallery != null
        
        LET artworks = (
            FOR artwork, artworkEdge IN 1..1 OUTBOUND exhibition ${EdgeNames.FROMCollectionTOArtwork}
            SORT artworkEdge.exhibitionOrder ASC
            LIMIT 5
            RETURN {
                [artwork._id]: {
                    _id: artwork._id,
                    artworkImage: artwork.artworkImage,
                    artworkTitle: artwork.artworkTitle
                }
            }
        )
        
        SORT exhibition.exhibitionDates.exhibitionStartDate.value DESC
        LIMIT 0, @limit
        
        RETURN {
            artworkPreviews: artworks,
            exhibitionId: exhibition._id,
            galleryId: gallery._id,
            exhibitionDuration: exhibition.exhibitionDates,
            openingDate: {value: exhibition.exhibitionDates.exhibitionStartDate.value},
            closingDate: {value: exhibition.exhibitionDates.exhibitionEndDate.value},
            galleryLogo: gallery.galleryLogo,
            galleryName: gallery.galleryName,
            exhibitionTitle: exhibition.exhibitionTitle,
            exhibitionArtist: exhibition.exhibitionArtist,
            exhibitionLocation: {
                exhibitionLocationString: exhibition.exhibitionLocation.locationString,
                coordinates: exhibition.exhibitionLocation.coordinates
            },
            exhibitionPrimaryImage: {
                value: exhibition.exhibitionPrimaryImage.value
            },
            receptionDates: exhibition.receptionDates
        }
    `
  
    try {
      const edgeCursor = await this.db.query(getExhibitionPreviewQuery, { limit, uid });
      const exhibitionPreviews = await edgeCursor.all()

      let seenResults: {[key: string]: boolean} = {}
      if (uid){
        const previewsPromises: any = []
        exhibitionPreviews.forEach((exhibition: any) => {
          previewsPromises.push(this.getUserViewedExhibition({exhibitionId: exhibition.exhibitionId, uid}))
        });
        const results = await Promise.allSettled(previewsPromises);
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                seenResults = { ...seenResults, ...result.value };
            }
        });
      }

      const results = exhibitionPreviews.reduce((acc, obj) => 
      {
        const userViewed = (seenResults?.[obj?.exhibitionId] || new Date(obj?.openingDate.value).toISOString() < SEVEN_DAYS_AGO ) ?? true
        acc[obj.exhibitionId as string] = {
          ...obj, 
          userViewed, 
          artworkPreviews: obj.artworkPreviews.reduce((acc2 : any, obj2: any) => ({...acc2, ...obj2 }), {})}
        return acc 
      }, {})

      return results;
  
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  
  public async listActiveExhibitionsByCity({ cityName }: { cityName: MapPinCities; }): Promise<any> {
    if (!cityName) {
      throw new Error('cityName is required');
    }
    const newYorkLocalities = ['New York', 'Brooklyn', 'Manhattan']
    if (cityName === "New York"){
      try{
        const exhibitionMapPin: {[key: string]: ExhibitionMapPin} = {};
        const promises: Promise<any>[] = []
        newYorkLocalities.forEach((locality) => {
          console.log('locality', locality)
          promises.push(this.listActiveExhibitionsByLocality({locality}))
        })
        const results = await Promise.all(promises)
        results.forEach((result) => {
          Object.keys(result).forEach((key) => {
            exhibitionMapPin[key] = result[key]
          })
        })
        return {...exhibitionMapPin}
      } catch(error: any){
        throw new Error(error.message)
      }
    }
    throw new Error ('city not supported')
  }

  public async listActiveExhibitionsByLocality({locality} : {locality: string}): Promise<any>{
    const findCollections = `
    WITH ${CollectionNames.Galleries}, ${CollectionNames.Exhibitions}, ${CollectionNames.Cities}
    FOR city IN ${CollectionNames.Cities}
        FILTER city.value == @locality
        FOR exhibition IN 1..1 INBOUND city ${EdgeNames.FROMExhibitionTOCity}
            FILTER exhibition.published == true AND exhibition.exhibitionDates.exhibitionStartDate.value <= @currentDatePlusSeven AND exhibition.exhibitionDates.exhibitionEndDate.value >= @todayMinusOne
            LET googleMapsPlaceId = (
                FOR e IN [exhibition]
                LET placeId = e.exhibitionLocation ? e.exhibitionLocation.googleMapsPlaceId : null
                RETURN placeId ? placeId.value : null
            )[0]
            LET gallery = FIRST(
                FOR gallery IN 1..1 INBOUND exhibition ${EdgeNames.FROMGalleryTOExhibition}
                    RETURN gallery
            )
            SORT googleMapsPlaceId, exhibition.exhibitionDates.exhibitionStartDate DESC
            COLLECT locationId = googleMapsPlaceId INTO groupByLocation = {exhibition, gallery}
            LET mostRecentExhibition = FIRST(groupByLocation)
            RETURN {
                locationId: locationId,
                galleryId: mostRecentExhibition.gallery._id,
                galleryName: mostRecentExhibition.gallery.galleryName,
                galleryLogo: mostRecentExhibition.gallery.galleryLogo,
                // Most recent exhibition information
                exhibitionId: mostRecentExhibition.exhibition._key,
                exhibitionTitle: mostRecentExhibition.exhibition.exhibitionTitle,
                exhibitionLocation: mostRecentExhibition.exhibition.exhibitionLocation,
                exhibitionPrimaryImage: mostRecentExhibition.exhibition.exhibitionPrimaryImage,
                exhibitionArtist: mostRecentExhibition.exhibition.exhibitionArtist,
                exhibitionDates: mostRecentExhibition.exhibition.exhibitionDates,
                receptionDates: mostRecentExhibition.exhibition.receptionDates,
                _id: mostRecentExhibition.exhibition._id,
                currentDate: @currentDatePlusSeven, 
                start: mostRecentExhibition.exhibition.exhibitionDates.exhibitionEndDate.value
            }    
    `;
    try{
      const currentDate = new Date();
      const currentDatePlusSeven = currentDate.setDate(currentDate.getDate() + 7)
      const todayMinusOne = currentDate.setDate(currentDate.getDate() - 1)

      const edgeCursor = await this.db.query(findCollections, { 
        locality, 
        currentDatePlusSeven: new Date(currentDatePlusSeven).toISOString(), 
        todayMinusOne: new Date(todayMinusOne).toISOString()
      });
      const exhibitionsAndPreviews: ExhibitionMapPin[] = await edgeCursor.all();

      // remove duplicate galleries
      exhibitionsAndPreviews.sort((a, b) => {
        if (!a.exhibitionDates.exhibitionEndDate.value || !b.exhibitionDates.exhibitionEndDate.value) return 0
        if (a.exhibitionDates.exhibitionEndDate.value < b.exhibitionDates.exhibitionEndDate.value) return 1 
        return -1
      })

      const today = new Date();
      

      const exhibitionMapPin: {[key: string]: ExhibitionMapPin} = {};
      exhibitionsAndPreviews.forEach((exhibitionAndPreview : ExhibitionMapPin) => {
        const locationId = exhibitionAndPreview.exhibitionLocation.googleMapsPlaceId?.value
        if (!locationId) return  // skip if no location
        if (!exhibitionAndPreview.exhibitionDates.exhibitionEndDate.value || 
          today > new Date(exhibitionAndPreview.exhibitionDates.exhibitionEndDate.value)) return // skip if exhibition has ended
        if (!exhibitionMapPin[locationId]){
          exhibitionMapPin[locationId] = exhibitionAndPreview
        } else if (
          exhibitionAndPreview?.exhibitionDates?.exhibitionEndDate?.value && 
          exhibitionAndPreview.exhibitionDates.exhibitionEndDate.value !== null &&
          exhibitionMapPin[locationId]?.exhibitionDates?.exhibitionEndDate?.value &&
          exhibitionMapPin[locationId].exhibitionDates.exhibitionEndDate?.value != null &&
          exhibitionMapPin[locationId].exhibitionDates.exhibitionEndDate.value! > 
          exhibitionAndPreview.exhibitionDates.exhibitionEndDate.value
      ) {
          exhibitionMapPin[locationId] = exhibitionAndPreview;
      }
      })
      return {...exhibitionMapPin}
    } catch(error: any){
      throw new Error(error.message)
    }
  }

  private async getExhibitionImage({key}: {key: string}): Promise<any> {
    const exhibitionKey = this.generateExhibitionId({exhibitionId: key})
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

  public async readAllExhibitions(): Promise<void>{
    const getExhibitionsQuery = `
    WITH ${CollectionNames.Exhibitions}
    FOR exhibition IN ${CollectionNames.Exhibitions}
    RETURN {_id: exhibition._id}
  `;

  try {
    const edgeCursor = await this.db.query(getExhibitionsQuery);
    const artworks = await edgeCursor.all();

    const promises: Promise<any>[] = []

    artworks.forEach((element) => {
      if (!element._id) return
      promises.push(this.getExhibitionById({exhibitionId: element._id}))
    })

    await Promise.allSettled(promises)
  } catch (error: any) {
    throw new Error(`error getting exhibition ${error.message}`);
  }

  }

  public async listAllExhibitionArtworks({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<any> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});

    let exhibitionArtworkIds;

    try {
      exhibitionArtworkIds = await this.listAllExhibitionArtworkEdges({exhibitionId : fullExhibitionId});
    } catch (error: any) {
      throw new Error(`unable to list exhibition artworks: ${error.message}`);
    }

    let artworkResults: Artwork[] = [];
    if (exhibitionArtworkIds) {
      const artworkPromises = exhibitionArtworkIds.map(
        async (artworkEdge: Edge) => {
          if (artworkEdge) {
            try {
              const artwork = await this.artworkService.readArtwork(
                artworkEdge._to!,
              );
              if (artwork) {
                // Append the exhibitionOrder from the edge to the artwork
                artwork.exhibitionOrder = artworkEdge.exhibitionOrder;
              }
              return artwork;
            } catch (error) {
              // throw new Error(`'Error handling artwork:', ${artworkEdge}`);
            }
          }
          return null;
        },
      );
      const results = await Promise.all(artworkPromises);
      artworkResults = results.filter(
        (result): result is Artwork =>
          result !== null && result?.artworkId !== undefined,
      );
    }

    return artworkResults.reduce(
      (acc, artwork) => ({...acc, [artwork.artworkId as string]: artwork}),
      {},
    );
  }

  public async listAllExhibitionArtworksWithLikes({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<any> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});

    let exhibitionArtworkIds;

    try {
      exhibitionArtworkIds = await this.listAllExhibitionArtworkEdges({exhibitionId : fullExhibitionId});
    } catch (error: any) {
      throw new Error(`unable to list exhibition artworks: ${error.message}`);
    }

    let artworkResults: Artwork[] = [];
    if (exhibitionArtworkIds) {
      const artworkPromises = exhibitionArtworkIds.map(
        async (artworkEdge: Edge) => {
          if (artworkEdge) {
            try {
              const artwork = await this.artworkService.readArtwork(
                artworkEdge._to!,
              );
              if (artwork && artwork.artworkId) {
                // Append the exhibitionOrder from the edge to the artwork
                artwork.exhibitionOrder = artworkEdge.exhibitionOrder;

                const likes = await this.edgeService.getAllEdgesFromNode({
                  edgeName: EdgeNames.FROMDartaUserTOArtworkLIKE,
                  from: artwork.artworkId!,
                });


                artwork.likes = likes.length;
              
                // Fetch the number of saves from EdgeNames.FROMDartaUserTOArtworkLIKE
                const saves = await this.edgeService.getAllEdgesFromNode({
                  edgeName: EdgeNames.FROMDartaUserTOArtworkSAVE,
                  from: artwork.artworkId!,
                });
                artwork.saves = saves.length;

                // Fetch the number of views from EdgeNames.FROMDartaUserTOArtworkVIEW
                const views = await this.edgeService.getAllEdgesFromNode({
                  edgeName: EdgeNames.FROMDartaUserTOArtworkVIEWED,
                  from: artwork.artworkId!,
                });

                artwork.views = views.length;

                // Fetch the number of dislikes from EdgeNames.FROMDartaUserTOArtworkDISLIKE
                const dislikes = await this.edgeService.getAllEdgesFromNode({
                  edgeName: EdgeNames.FROMDartaUserTOArtworkDISLIKE,
                  from: artwork.artworkId!,
                });

                artwork.dislikes = dislikes.length;

              }
             


              return artwork;
            } catch (error) {
              // throw new Error(`'Error handling artwork:', ${artworkEdge}`);
            }
          }
          return null;
        },
      );
      const results = await Promise.all(artworkPromises);
      artworkResults = results.filter(
        (result): result is Artwork =>
          result !== null && result?.artworkId !== undefined,
      );
    }

    return artworkResults.reduce(
      (acc, artwork) => ({...acc, [artwork.artworkId as string]: artwork}),
      {},
    );
  }

  public async listAllExhibitionArtworkEdges({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<string[] | void> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});

    let exhibitionArtworkIds;

    try {
      exhibitionArtworkIds = await this.edgeService.getAllEdgesFromNode({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        from: fullExhibitionId,
      });
    } catch (error: any) {
      throw new Error(`unable to list exhibition artworks: ${error.message}`);
    }

    return exhibitionArtworkIds
  }

  public async listPreviewExhibitionArtworks({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<any> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});

    let exhibitionArtworkIds;

    try {
      exhibitionArtworkIds = await this.edgeService.getAllEdgesFromNode({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        from: fullExhibitionId,
      });
    } catch (error: any) {
      throw new Error(`unable to list exhibition artworks: ${error.message}`);
    }

    let artworkResults: Artwork[] = [];
    if (exhibitionArtworkIds) {
      const artworkPromises = exhibitionArtworkIds.map(
        async (artworkEdge: Edge) => {
          if (artworkEdge) {
            try {
              const artwork = await this.artworkService.readArtwork(
                artworkEdge._to!,
              );
              if (artwork) {
                // Append the exhibitionOrder from the edge to the artwork
                artwork.exhibitionOrder = artworkEdge.exhibitionOrder;
              }
              return artwork;
            } catch (error) {
              throw new Error(`'Error handling artwork:', ${artworkEdge}`);
            }
          }
          return null;
        },
      );
      const results = await Promise.all(artworkPromises);
      artworkResults = results.filter(
        (result): result is Artwork =>
          result !== null && result?.artworkId !== undefined,
      );
    }

    const artworkObj = artworkResults.reduce(
      (acc, artwork) => ({...acc, [artwork.artworkId as string]: artwork}),
      {},
    );
    return filterOutPrivateRecordsMultiObject(artworkObj)
  }

  public async createExhibitionToArtworkEdgeWithExhibitionOrder({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }): Promise<string> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const fullArtworkId = this.artworkService.generateArtworkId({artworkId});

    try {
      const artworkEdges = await this.edgeService.getAllEdgesFromNode({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        from: fullExhibitionId,
      });

      let exhibitionOrder = artworkEdges?.length;
      if (artworkEdges?.length > 0) {
        exhibitionOrder = artworkEdges.length;
      }

      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        from: fullExhibitionId,
        to: fullArtworkId,
        data: {
          value: 'SHOWS',
          exhibitionOrder,
        },
      });
      return exhibitionOrder.toString();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async reOrderExhibitionToArtworkEdgesAfterDelete({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<boolean> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});

    try {
      const artworkEdges = await this.edgeService.getAllEdgesFromNode({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        from: fullExhibitionId,
      });

      const currentLength = artworkEdges.length;
      const highestExhibitionOrder = artworkEdges.reduce((max, obj) => obj.exhibitionOrder > max ? obj.exhibitionOrder : max, -Infinity);

      if (currentLength + 1 === highestExhibitionOrder) return true;

      const artworkEdgesExhibitionOrder = artworkEdges.sort((a, b) => a.exhibitionOrder - b.exhibitionOrder);

      const promises = [];
      for (let i = 0; i < artworkEdgesExhibitionOrder.length; i +=1) {
        const edge = artworkEdgesExhibitionOrder[i];
        if (edge.exhibitionOrder !== i) {
          promises.push(
            this.edgeService.upsertEdge({
              edgeName: EdgeNames.FROMCollectionTOArtwork,
              from: fullExhibitionId,
              to: edge._to!,
              data: {
                value: 'SHOWS',
                exhibitionOrder: i,
              },
            }),
          );
        }
      }
      await Promise.all(promises);
    } catch (error: any) {
      throw new Error(error.message);
    }

    return true;
  }

  public async batchEditArtworkToLocationEdgesByExhibitionId({
    locationId,
    uid,
    exhibitionId,
  }: {
    locationId: string;
    uid: string;
    exhibitionId: string;
  }): Promise<boolean> {
    const exhibition = await this.getExhibitionById({exhibitionId});
    const artworks = exhibition?.artworks;
    const gallery = await this.galleryService.getGalleryIdFromUID({
      uid,
    });
    const location: any = gallery[locationId as any];

    if (artworks && location) {
      await this.batchEditArtworkToLocationEdges({
        locationData: location,
        artwork: artworks,
      });
    }

    throw new Error('Method not implemented.');
  }

  public async batchEditArtworkToLocationEdges({
    locationData,
    artwork,
  }: {
    locationData: IBusinessLocationData;
    artwork: {[key: string]: Artwork};
  }): Promise<boolean> {
    const promises = Object.values(artwork).map(async (art: Artwork) => {
      if (art?.artworkId) {
        await this.editArtworkToLocationEdge({
          locationData,
          artworkId: art.artworkId,
        });
      }
      return false;
    });

    try {
      await Promise.all(promises);
    } catch {
      return false;
    }

    return true;
  }

  public async editArtworkToLocationEdge({
    locationData,
    artworkId,
  }: {
    locationData: IBusinessLocationData;
    artworkId: string;
  }): Promise<boolean> {
    let locality; let city;
    const fullArtworkId = this.artworkService.generateArtworkId({artworkId});

    if (locationData?.locality?.value) {
      locality = locationData.locality.value;
      const localityNode = await this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.Localities,
        data: {value: locality.toUpperCase()},
      });
      try {
        await this.edgeService.upsertEdge({
          edgeName: EdgeNames.FROMArtworkTOLocality,
          from: fullArtworkId,
          to: localityNode._id,
          data: {
            value: 'LOCALITY',
          },
        });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
    if (locationData?.city?.value) {
      city = locationData.city.value.toUpperCase();
      try {
        const cityNode = await this.nodeService.upsertNodeByKey({
          collectionName: CollectionNames.Localities,
          data: {value: city.toUpperCase()},
        });

        await this.edgeService.upsertEdge({
          edgeName: EdgeNames.FROMArtworkTOCity,
          from: fullArtworkId,
          to: cityNode._id,
          data: {
            value: 'CITY',
          },
        });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
    return true;
  }


  // TO-DO
  // eslint-disable-next-line class-methods-use-this
  public async deleteArtworkToLocationEdge(): Promise<boolean> {
    return true;
  }

  public async deleteExhibitionToArtworkEdge({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }): Promise<boolean> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const fullArtworkId = this.artworkService.generateArtworkId({artworkId});

    try {
      await this.edgeService.deleteEdge({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        from: fullExhibitionId,
        to: fullArtworkId,
      });
      // await this.reOrderExhibitionToArtworkEdgesAfterDelete({exhibitionId});
      return true;
    } catch (error: any) {
      throw new Error(
        `unable to delete edge from collection to artwork: ${error.message}`,
      );
    }
  }

  public async verifyGalleryOwnsExhibition({
    exhibitionId,
    galleryId,
  }: {
    exhibitionId: string;
    galleryId: string;
  }): Promise<boolean> {
    const to = this.generateExhibitionId({exhibitionId});
    const from = this.galleryService.generateGalleryId({galleryId});
    try {
      const results = await this.edgeService.getEdge({
        edgeName: EdgeNames.FROMGalleryTOExhibition,
        from,
        to,
      });
      if (results) {
        return true;
      }
    } catch (error: any) {
      throw new Error(
        `error verifying the gallery owns the artwork: ${error.message}`,
      );
    }

    return false;
  }

  public async reOrderExhibitionArtwork({
    exhibitionId,
    artworkId,
    desiredIndex,
    currentIndex,
  }: {
    exhibitionId: string;
    artworkId: string;
    desiredIndex: number;
    currentIndex: number;
  }): Promise<boolean> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const fullArtworkId = this.artworkService.generateArtworkId({artworkId});

    try {
      const artworkEdges = await this.edgeService.getAllEdgesFromNode({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        from: fullExhibitionId,
      });
      const desiredLocation = artworkEdges.filter((edge: Edge) => edge.exhibitionOrder === desiredIndex);
      const currentLocation = artworkEdges.filter((edge: Edge) => edge.exhibitionOrder === currentIndex);
      if (currentLocation[0]?._to !== fullArtworkId) {
        return this.reOrderExhibitionToArtworkEdgesAfterDelete({exhibitionId})
      }
      const promises = [
        this.edgeService.upsertEdge({
          edgeName: EdgeNames.FROMCollectionTOArtwork,
          from: fullExhibitionId,
          to: currentLocation[0]._to!,
          data: {
            value: 'SHOWS',
            exhibitionOrder: desiredIndex,
          },
        }),
      ];
      if (desiredLocation) {
        promises.push(
          this.edgeService.upsertEdge({
            edgeName: EdgeNames.FROMCollectionTOArtwork,
            from: fullExhibitionId,
            to: desiredLocation[0]._to!,
            data: {
              value: 'SHOWS',
              exhibitionOrder: currentIndex,
            },
          }),
        );
      }
      await Promise.all(promises);
      return this.reOrderExhibitionToArtworkEdgesAfterDelete({exhibitionId});
    } catch (error: any) {
      throw new Error(
        `error reordering artwork: ${error.message}`,
      );
    }
  }

  public async setViewedExhibition({
    exhibitionId,
    uid,
  }: {
    exhibitionId: string;
    uid: string;
  }): Promise<boolean> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const fullUserId = this.userService.generateDartaUserId({uid});

    try {
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMDartaUserTOExhibitionVIEWED,
        from: fullUserId,
        to: fullExhibitionId,
        data: {
          value: 'VIEWED',
        },
      });
      return true;
    } catch (error: any) {
      throw new Error(
        `error user viewing exhibition: ${error.message}`,
      );
    }
  }

  public async getUserViewedExhibition({
    exhibitionId,
    uid,
  }: {
    exhibitionId: string;
    uid: string;
  }): Promise<{[key: string]: boolean}> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const fullUserId = this.userService.generateDartaUserId({uid});

    try {
      const results = await this.edgeService.getEdge({
        edgeName: EdgeNames.FROMDartaUserTOExhibitionVIEWED,
        from: fullUserId,
        to: fullExhibitionId,
      });
      if (results) {
        return {[fullExhibitionId]: true};
      }
    } catch (error: any) {
      throw new Error(
        `error user viewing exhibition: ${error.message}`,
      );
    }

    return {[fullExhibitionId]: false};;
  }

  public async getUnViewedExhibitionsForUser({uid} : {uid: string}): Promise<{[key: string] : Array<string>} | void>{
    const getExhibitionPreviewQuery = `
    WITH ${CollectionNames.Galleries}, ${CollectionNames.Exhibitions}, ${CollectionNames.Artwork}, 
    ${CollectionNames.DartaUsers}, ${EdgeNames.FROMGalleryTOExhibition}, ${EdgeNames.FROMDartaUserTOGalleryVIEWED}, 
    ${EdgeNames.FROMDartaUserTOGalleryFOLLOWS}
      FOR user IN ${CollectionNames.DartaUsers}
          FILTER user._id == @userId
          LET followedGalleries = (
              FOR gallery IN 1..1 OUTBOUND user ${EdgeNames.FROMDartaUserTOGalleryFOLLOWS}
              RETURN gallery._id
          )
          LET galleryExhibitions = (
              FOR galleryId IN followedGalleries
                  LET unviewedExhibitions = (
                      FOR exhibition IN ${CollectionNames.Exhibitions}
                      FOR v, e IN 1..1 OUTBOUND DOCUMENT(${CollectionNames.Galleries}, galleryId) ${EdgeNames.FROMGalleryTOExhibition}
                            FILTER DATE_ISO8601(exhibition.exhibitionDates.exhibitionStartDate.value) >= DATE_ISO8601(@cutoff)
                              FILTER e._to == exhibition._id
                              LET viewed = (
                                  FOR userView IN 1..1 OUTBOUND exhibition._id ${EdgeNames.FROMDartaUserTOGalleryVIEWED}
                                  FILTER userView._to == user._id
                                  RETURN 1
                              )
                              FILTER LENGTH(viewed) == 0
                              RETURN {
                                exhibitionId: exhibition._id,
                                exhibitionStartDate: exhibition.exhibitionDates.exhibitionStartDate.value
                              }
                  )
                  FILTER LENGTH(unviewedExhibitions) > 0
                  RETURN { [galleryId]: unviewedExhibitions }
          )
      RETURN FLATTEN(galleryExhibitions)
    `
    const fullUserId = this.userService.generateDartaUserId({uid})
    try {
      const edgeCursor = await this.db.query(getExhibitionPreviewQuery, { userId: fullUserId, cutoff: SEVEN_DAYS_AGO });
      const exhibitionPreviews = await edgeCursor.next()
      const results = exhibitionPreviews.reduce((acc: any, obj: any) => {
        const galleryId = Object.keys(obj)[0]
        const values: any = Object.values(obj)[0]
        const startDate = values[0]?.exhibitionStartDate
        if (startDate >= SEVEN_DAYS_AGO && values?.[0]?.exhibitionId) {
          acc[galleryId] = values[0].exhibitionId
        }
        return acc
      }, {})
      return results
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async addExhibitionToUserSaved({exhibitionId, uid}: {exhibitionId: string, uid: string}): Promise<boolean>{
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const fullUserId = this.userService.generateDartaUserId({uid});

    try {
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMDartaUserTOExhibitionSAVE,
        from: fullUserId,
        to: fullExhibitionId,
        data: {
          createdAt: new Date().toISOString(),
        },
      });
      return true
    } catch (error: any) {
      throw new Error(
        `error user following exhibition: ${error.message}`,
      );
    }
  }

  public async removeExhibitionFromUserSaved({exhibitionId, uid}: {exhibitionId: string, uid: string}): Promise<boolean>{
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});
    const fullUserId = this.userService.generateDartaUserId({uid});

    try {
      await this.edgeService.deleteEdge({
        edgeName: EdgeNames.FROMDartaUserTOExhibitionSAVE,
        from: fullUserId,
        to: fullExhibitionId,
      });
      return true;
    } catch (error: any) {
      throw new Error(
        `error user following exhibition: ${error.message}`,
      );
    }
  }

  public async listExhibitionForUserSavedCurrent({uid}: {uid: string}): Promise<Array<string>>{
    try{
      const fullUserId = this.userService.generateDartaUserId({uid});
      const results = await this.edgeService.getAllEdgesFromNode({
        edgeName: EdgeNames.FROMDartaUserTOExhibitionSAVE,
        from: fullUserId
      })
      return results.map((edge: Edge) => edge._to!);
    }catch(error: any){
      throw new Error(error.message)
    }
  }
  
  public async dartaUserExhibitionRating({uid, exhibitionId, rating} : { uid: string, exhibitionId: string, rating: string,}): Promise<boolean>{
    try {
      const fullExhibitionId = this.generateExhibitionId({exhibitionId});
     await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMDartaUserTOExhibitionRATING,
        from: this.userService.generateDartaUserId({uid}),
        to: fullExhibitionId,
        data: {
          rating,
          date: new Date().toISOString()
        }
      })
      return true
    } catch(error : any){
      throw new Error(error.message)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public generateExhibitionId({exhibitionId}: {exhibitionId: string}): string {
    return exhibitionId.includes(`${CollectionNames.Exhibitions}`)
      ? exhibitionId
      : `${CollectionNames.Exhibitions}/${exhibitionId}`;
  }
}
