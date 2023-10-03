import {Artwork, Exhibition, ExhibitionObject, IBusinessLocationData, Images} from '@darta-types';
import {Database} from 'arangojs';
import {Edge} from 'arangojs/documents';
import {inject, injectable} from 'inversify';
import _ from 'lodash';
import {Client} from 'minio';

import {CollectionNames, EdgeNames} from '../config/collections';
import {newExhibitionShell} from '../config/templates';
import {ImageController} from '../controllers/ImageController';
import {
  filterOutPrivateRecordsMultiObject,
  filterOutPrivateRecordsSingleObject,
} from '../middleware/';
import {
  IArtworkService,
  IEdgeService,
  IExhibitionService,
  IGalleryService,
  INodeService,
} from './interfaces';

const BUCKET_NAME = 'exhibitions';

@injectable()
export class ExhibitionService implements IExhibitionService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('IArtworkService') private readonly artworkService: IArtworkService,
    @inject('MinioClient') private readonly minio: Client,
    @inject('ImageController')
    private readonly imageController: ImageController,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
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
    return await this.getExhibitionById({exhibitionId});
  }

  public async readGalleryExhibitionForUser({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void> {
    const results = await this.getExhibitionById({
      exhibitionId,
    });
    if (!results) {
      return;
    }
    const {artworks, ...exhibition} = results;
    const cleanedExhibition = filterOutPrivateRecordsSingleObject(exhibition);
    const cleanedArtworks = filterOutPrivateRecordsMultiObject(artworks);

    return {
      ...cleanedExhibition,
      artworks: {
        ...cleanedArtworks,
      },
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
    const {artworks, exhibitionPrimaryImage, ...remainingExhibitionProps} =
      exhibition;

    // #########################################################################
    //                             SAVE THE EXHIBITION IMAGE
    // #########################################################################

    const {exhibitionImage} = await this.getExhibitionImage({
      key: exhibitionId,
    });

    // Don't overwrite an image
    let fileName: string = crypto.randomUUID();
    if (exhibitionImage?.exhibitionPrimaryImage?.fileName) {
      fileName = exhibitionImage.exhibitionPrimaryImage.fileName;
    }

    let bucketName = exhibitionPrimaryImage?.bucketName ?? null;
    let value = exhibitionPrimaryImage?.value ?? null;
    if (exhibitionPrimaryImage?.fileData) {
      try {
        const artworkImageResults =
          await this.imageController.processUploadImage({
            fileBuffer: exhibitionPrimaryImage?.fileData,
            fileName,
            bucketName: BUCKET_NAME,
          });
        ({bucketName, value} = artworkImageResults);
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
      exhibitionPrimaryImage: {
        bucketName,
        value,
        fileName,
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
      throw new Error('error saving artwork');
    }

    const returnExhibition: any = {
      ...savedExhibition,
    };

    return returnExhibition;
  }

  public async getExhibitionById({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void> {
    const fullExhibitionId = this.generateExhibitionId({exhibitionId});

    const exhibitionQuery = `
      LET exhibition = DOCUMENT(@fullExhibitionId)
      RETURN exhibition      
      `;

    // LOL terrible as
    let exhibition: Exhibition = {} as Exhibition;
    try {
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
    if (exhibition?.exhibitionPrimaryImage?.fileName && exhibition?.exhibitionPrimaryImage?.bucketName) {
      const {fileName, bucketName} = exhibition.exhibitionPrimaryImage;
      imageValue = await this.imageController.processGetFile({
        fileName,
        bucketName,
      });
      exhibition.exhibitionPrimaryImage.value = imageValue;
    }

    return {
      ...exhibition,
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
        async (exhibitionId: string) => {
          return await this.getExhibitionById({exhibitionId});
        },
      );

      const galleryExhibitions = await Promise.all(galleryOwnedArtworkPromises);
      if (galleryExhibitions) {
        return galleryExhibitions as Exhibition[];
      }
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
  } catch (error: any) {
    throw new Error(error.message);
  }
  }


  public async listGalleryExhibitionPreviewsForUser({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<ExhibitionObject | void> {
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
  } catch (error: any) {
    throw new Error(error.message);
  }
  }

  public async listExhibitionsPreviewsForUserByLimit({limit}: {limit: number}): Promise<{[key: string]: Exhibition} | void> {
    const getExhibitionsQuery = `
      WITH ${CollectionNames.Exhibitions}
      FOR exhibition IN ${CollectionNames.Exhibitions}
      SORT exhibition.exhibitionDates.exhibitionStartDate.value ASC
      LIMIT 0, @limit
      RETURN exhibition._id      
    `;
  
    try {
      const edgeCursor = await this.db.query(getExhibitionsQuery, { limit });
      const exhibitionIds = (await edgeCursor.all()).filter(el => el);
  
      // Since we want a combined result, let's merge the promises for each exhibition ID.
      const combinedPromises = exhibitionIds.map(async (exhibitionId: string) => {
        const exhibition = filterOutPrivateRecordsMultiObject(await this.getExhibitionPreviewById({ exhibitionId }));
        const artworks = await this.listPreviewExhibitionArtworks({ exhibitionId });
        const gallery = filterOutPrivateRecordsMultiObject(await this.galleryService.getGalleryByExhibitionId({ exhibitionId }));
  
        return {
          exhibition,
          artworks,
          gallery
        };
      });
  
      const combinedResults = await Promise.all(combinedPromises);
  
      // Now let's transform the combined results into the desired structures
      const galleryExhibitionsObject: {[key: string]: any} = {};
      const galleryObject: {[key: string]: any} = {};
      const artworkObject: {[key: string]: any} = {};
      const preview: {[key: string]: any} = {};
  
      combinedResults.forEach(result => {
        galleryExhibitionsObject[result.exhibition.exhibitionId as string] = result.exhibition;
        galleryObject[result.gallery._id as string] = result.gallery;
        
        Object.keys(result.artworks).forEach(artworkId => {
          artworkObject[artworkId] = result.artworks[artworkId];
        });
  
        // Constructing the preview
        preview[result.exhibition.exhibitionId] = {
          exhibitionId: result.exhibition.exhibitionId,
          artworkIds: Object.keys(result.artworks),
          galleryId: result.gallery._id
        };
      });
  
      return {
        exhibitions: galleryExhibitionsObject,
        galleries: galleryObject,
        artwork: artworkObject,
        exhibitionPreviews: preview
      } as any;
    } catch (error: any) {
      throw new Error(error.message);
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
      results = await Promise.all(promises);
    } catch (error: any) {
      throw new Error(`unable to delete a node: ${error.message}`);
    }

    if (results) {
      return true;
    }

    return false;

    // You can further handle results if needed (e.g., check for errors)
  }

  private async getExhibitionImage({key}: {key: string}): Promise<any> {
    const findGalleryKey = `
      LET doc = DOCUMENT(CONCAT("${CollectionNames.Exhibitions}/", @key))
      RETURN {
        exhibitionPrimaryImage: doc.exhibitionPrimaryImage
      }
    `;

    try {
      const cursor = await this.db.query(findGalleryKey, {key});
      const exhibitionPrimaryImage: Images = await cursor.next();
      return {exhibitionPrimaryImage};
    } catch (error: any) {
      throw new Error(error.message);
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

    return artworkResults.reduce(
      (acc, artwork) => ({...acc, [artwork.artworkId as string]: artwork}),
      {},
    );
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

    const previewArtworkIds = exhibitionArtworkIds.filter((artworkEdge: Edge) => {
      if (artworkEdge.exhibitionOrder <= 5) {
        return artworkEdge
      }
    })

    let artworkResults: Artwork[] = [];
    if (exhibitionArtworkIds) {
      const artworkPromises = previewArtworkIds.map(
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
      const highestExhibitionOrder = artworkEdges.reduce((max, obj) => {
        return obj.exhibitionOrder > max ? obj.exhibitionOrder : max;
      }, -Infinity);

      if (currentLength + 1 === highestExhibitionOrder) return true;

      const artworkEdgesExhibitionOrder = artworkEdges.sort((a, b) => {
        return a.exhibitionOrder - b.exhibitionOrder;
      });

      const promises = [];
      for (let i = 0; i < artworkEdgesExhibitionOrder.length; i++) {
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
        return await this.editArtworkToLocationEdge({
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
    let locality, city;
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
      await this.reOrderExhibitionToArtworkEdgesAfterDelete({exhibitionId});
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
      const desiredLocation = artworkEdges.filter((edge: Edge) => {
        return edge.exhibitionOrder === desiredIndex;
      });
      const currentLocation = artworkEdges.filter((edge: Edge) => {
        return edge.exhibitionOrder === currentIndex;
      });
      if (currentLocation[0]._to !== fullArtworkId) {
        throw new Error('incorrect location!');
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
        `error verifying the gallery owns the artwork: ${error.message}`,
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private generateExhibitionId({exhibitionId}: {exhibitionId: string}): string {
    return exhibitionId.includes(`${CollectionNames.Exhibitions}`)
      ? exhibitionId
      : `${CollectionNames.Exhibitions}/${exhibitionId}`;
  }
}
