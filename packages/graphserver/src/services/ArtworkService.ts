import {Artwork, Dimensions, Images} from '@darta-types';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';
import _ from 'lodash';

import {CollectionNames, EdgeNames} from '../config/collections';
import {newArtworkShell} from '../config/templates';
import {ImageController} from '../controllers/ImageController';
import {ArtworkNode, Edge, Node} from '../models/models';
import {
  IArtworkService,
  IEdgeService,
  IGalleryService,
  INodeService,
} from './interfaces';
import {ArtworkAndGallery} from './interfaces/IArtworkService';

const BUCKET_NAME = 'artwork';

@injectable()
export class ArtworkService implements IArtworkService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('ImageController')
    private readonly imageController: ImageController,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
  ) {}

  public async createArtwork({
    galleryId,
    exhibitionOrder = null,
    exhibitionId = null,
  }: {
    galleryId: string;
    exhibitionOrder?: number | null;
    exhibitionId?: string | null;
  }): Promise<Artwork> {
    // create the artwork

    const artwork: Artwork = _.cloneDeep(newArtworkShell);
    artwork.artworkId = crypto.randomUUID();
    artwork.createdAt = new Date().toISOString();
    artwork.updatedAt = new Date().toISOString();
    if (exhibitionOrder) {
      artwork.exhibitionOrder = exhibitionOrder;
    }
    if (exhibitionId) {
      artwork.exhibitionId = exhibitionId;
    }

    if (!galleryId) {
      throw new Error('no gallery id present');
    }

    const artworkQuery = `
        INSERT @newArtwork INTO ${CollectionNames.Artwork} 
        RETURN NEW
      `;
    let newArtwork;

    try {
      const createArtworkCursor = await this.db.query(artworkQuery, {
        newArtwork: {...artwork, _key: artwork.artworkId, galleryId},
      });
      newArtwork = await createArtworkCursor.next();
    } catch (error: any) {
      throw new Error('error creating artwork');
    }

    // create the edge between the gallery and the artwork

    try {
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMGalleryToArtwork,
        from: `${galleryId}`,
        to: newArtwork._id,
        data: {value: 'created'},
      });
    } catch (error: any) {
      throw new Error('error creating artwork edge');
    }

    return newArtwork;
  }

  public async readArtwork(artworkId: string): Promise<Artwork | null> {
    // TO-DO: build out?
    const artwork = await this.getArtworkById(artworkId);

    return artwork;
  }

  public async readArtworkAndGallery(
    artworkId: string,
  ): Promise<ArtworkAndGallery> {
    // TO-DO: build out?
    const artwork = await this.getArtworkById(artworkId);

    // ############## get gallery ##############

    let galleryEdge: Edge;
    let gallery = null;

    if (artwork?._id) {
      galleryEdge = await this.edgeService.getEdgeWithTo({
        edgeName: EdgeNames.FROMGalleryToArtwork,
        to: artwork._id,
      });
      gallery = await this.galleryService.readGalleryProfileFromGalleryId({
        galleryId: galleryEdge._from,
      });
    }
    return {artwork, gallery};
  }

  public async editArtwork({
    artwork,
  }: {
    artwork: Artwork;
  }): Promise<ArtworkNode | null> {
    const artworkId = artwork?.artworkId;
    if (!artworkId) {
      return null;
    }

    const {
      artworkImage,
      artworkMedium,
      artworkPrice,
      artworkDimensions,
      artistName,
      artworkCreatedYear,
      ...remainingArtworkProps
    } = artwork;

    const artworkKey = `${CollectionNames.Artwork}/${artworkId}`;

    // Save the Artwork Image
    const currentArtworkImage = await this.getArtworkImage({key: artworkId});

    // Don't overwrite an image
    let fileName: string = crypto.randomUUID();
    if (currentArtworkImage?.artworkImage?.fileName) {
      fileName = currentArtworkImage.artworkImage.fileName;
    }

    let bucketName = artworkImage?.bucketName ?? null;
    let value = artworkImage?.value ?? null;

    if (artworkImage?.fileData) {
      try {
        const artworkImageResults =
          await this.imageController.processUploadImage({
            fileBuffer: artworkImage?.fileData,
            fileName,
            bucketName: BUCKET_NAME,
          });
        ({bucketName, value} = artworkImageResults);
      } catch (error) {
        throw new Error('error uploading image');
      }
    }

    // Save the Artwork

    const data = {
      ...remainingArtworkProps,
      artworkDimensions,
      artworkPrice,
      artworkCreatedYear,
      value: artwork?.slug?.value,
      updatedAt: new Date(),
      artworkImage: {
        bucketName,
        value,
        fileName,
      },
    };

    let savedArtwork: ArtworkNode | any = {};

    try {
      savedArtwork = await this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.Artwork,
        key: artworkId,
        data,
      });
    } catch (error) {
      throw new Error('error saving artwork');
    }

    // Artist Node
    const artistPromise = this.nodeService.upsertNodeByKey({
      collectionName: CollectionNames.ArtworkArtists,
      data: {value: artistName.value?.toUpperCase()},
    });

    // Artwork medium Node
    const mediumPromise = this.nodeService.upsertNodeByKey({
      collectionName: CollectionNames.ArtworkMediums,
      data: {value: artworkMedium?.value?.toLowerCase()},
    });

    // Artwork price (bucket)
    let pricePromise;
    if (artworkPrice && artworkPrice?.value) {
      pricePromise = this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.ArtworkPriceBuckets,
        data: {value: this.determinePriceBucket(artworkPrice.value)},
      });
    }

    // Artwork size (bucket)
    const sizePromise = this.nodeService.upsertNodeByKey({
      collectionName: CollectionNames.ArtworkSizeBuckets,
      data: {value: this.determineSizeBucket(artworkDimensions)},
    });

    // YEAR (bucket)
    let yearPromise;
    if (artworkCreatedYear && artworkCreatedYear.value) {
      yearPromise = this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.ArtworkCreatedBuckets,
        data: {value: this.determineYearBucket(artworkCreatedYear.value)},
      });
    }

    // Execute node promises in parallel
    const [artistNode, mediumNode, priceNode, sizeNode, yearNode] =
      await Promise.all([
        artistPromise,
        mediumPromise,
        pricePromise,
        sizePromise,
        yearPromise,
      ]);

    // Handle edge creations

    const edgesToCreate = [];

    if (artworkId && artistNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOArtist,
        from: artworkKey,
        newTo: artistNode._id,
        data: {
          value: 'ARTIST',
        },
      });
    }

    if (artworkId && mediumNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkToMedium,
        from: artworkKey,
        newTo: mediumNode._id,
        data: {
          value: 'USES',
        },
      });
    }

    if (artworkId && priceNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOCostBucket,
        from: artworkKey,
        newTo: priceNode._id,
        data: {
          value: 'COST',
        },
      });
    }

    if (artworkId && sizeNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOSizeBucket,
        from: artworkKey,
        newTo: sizeNode._id,
        data: {
          value: 'SIZE',
        },
      });
    }

    if (artworkId && yearNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOCreateBucket,
        from: artworkKey,
        newTo: yearNode._id,
        data: {
          value: 'YEAR CREATED',
        },
      });
    }

    const edgePromises = edgesToCreate.map(edge =>
      this.edgeService.replaceMediumEdge(edge),
    );
    await Promise.all(edgePromises);

    return {
      ...savedArtwork,
      artistName: {value: artistNode?.value ?? null},
      artworkMedium: {value: mediumNode?.value ?? null},
    };
  }

  public async deleteArtwork({
    artworkId,
  }: {
    artworkId: string;
  }): Promise<boolean> {
    const artwork = await this.getArtworkById(artworkId);

    if (!artwork) {
      return false;
    }

    const key = `${CollectionNames.Artwork}/${artworkId}`;

    // #########################################################################
    //                             DELETE THE ARTWORK IMAGE
    // #########################################################################

    const {artworkImage} = artwork;

    if (artworkImage.bucketName && artworkImage.fileName) {
      try {
        await this.imageController.processDeleteImage({
          fileName: artworkImage.fileName,
          bucketName: artworkImage.bucketName,
        });
      } catch {
        throw new Error('error deleting artwork image');
      }
    }

    const edgesToDelete = [];

    // Gallery Edge
    try {
      await this.edgeService.deleteEdgeWithTo({
        edgeName: EdgeNames.FROMGalleryToArtwork,
        to: key,
      });
    } catch (error) {
      throw new Error('error deleting gallery edge');
    }

    // Artist Edge

    edgesToDelete.push({
      edgeName: EdgeNames.FROMArtworkTOArtist,
      from: key,
    });

    // Artwork medium

    edgesToDelete.push({
      edgeName: EdgeNames.FROMArtworkToMedium,
      from: key,
    });

    // Artwork price (bucket)

    edgesToDelete.push({
      edgeName: EdgeNames.FROMArtworkTOCostBucket,
      from: key,
    });

    // Artwork size (bucket)

    edgesToDelete.push({
      edgeName: EdgeNames.FROMArtworkTOSizeBucket,
      from: key,
    });

    // YEAR (bucket)

    edgesToDelete.push({
      edgeName: EdgeNames.FROMArtworkTOCreateBucket,
      from: key,
    });

    const edgePromises = edgesToDelete.map(edge =>
      this.edgeService.deleteEdgeWithFrom(edge),
    );

    // #########################################################################
    //                              DELETE THE ARTWORK
    //                        Including the Bucketed Stuff
    // #########################################################################

    try {
      await Promise.all(edgePromises);
      await this.nodeService.deleteNode({
        collectionName: CollectionNames.Artwork,
        id: key,
      });
    } catch (error) {
      throw new Error('error deleting artwork');
    }

    return true;
  }

  public async listArtworksByGallery({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<(Artwork | null)[] | null> {
    const getArtworksQuery = `
      WITH ${CollectionNames.Galleries}, ${CollectionNames.Artwork}
      FOR artwork IN OUTBOUND @galleryId ${EdgeNames.FROMGalleryToArtwork}
      RETURN artwork._id      
    `;

    try {
      const edgeCursor = await this.db.query(getArtworksQuery, {galleryId});
      const artworkIds = (await edgeCursor.all()).filter(el => el);

      const galleryOwnedArtworkPromises = artworkIds.map(
        async (artworkId: string) => {
          return await this.getArtworkById(artworkId);
        },
      );

      const galleryOwnedArtwork = await Promise.all(
        galleryOwnedArtworkPromises,
      );
      return galleryOwnedArtwork;
    } catch (error) {
      throw new Error('error getting artworks');
    }
  }

  public async getArtworkById(artworkId: string): Promise<Artwork | null> {
    const fullArtworkId = artworkId.includes('Artwork/')
      ? artworkId
      : `${CollectionNames.Artwork}/${artworkId}`;

    const artworkQuery = `
      LET artwork = DOCUMENT(@artworkId)
      RETURN artwork      
      `;

    let artwork: Artwork;

    try {
      const edgeCursor = await this.db.query(artworkQuery, {
        artworkId: fullArtworkId,
      });
      artwork = await edgeCursor.next();
    } catch (error) {
      return null;
    }

    // ################# Get Artist ###############
    let artistNameNode: Node | null = null;

    try {
      artistNameNode = await this.getArtistFromArtworkId(fullArtworkId);
    } catch (error) {
      throw new Error('error getting artist');
    }

    // ################# Get Medium ###############
    let mediumNameNode: Node | null = null;

    try {
      const results = await this.getMediumFromArtworkId(fullArtworkId);
      if (results) {
        mediumNameNode = results;
      }
    } catch (error) {
      throw new Error('error getting medium');
    }

    // ################# Artwork Image ###############

    const {artworkImage} = artwork;

    let artworkImageValue = null;

    if (artworkImage?.bucketName && artworkImage?.fileName) {
      try {
        artworkImageValue = await this.imageController.processGetFile({
          fileName: artworkImage.fileName,
          bucketName: artworkImage.bucketName,
        });
      } catch (error) {
        throw new Error('error getting artwork image');
      }
    }

    return {
      ...artwork,
      artworkMedium: {
        value: mediumNameNode?.value ?? '',
      },
      artistName: {
        value: artistNameNode?.value ?? '',
      },
      artworkImage: {
        ...artworkImage,
        value: artworkImageValue,
      },
    };
  }

  public async confirmGalleryArtworkEdge({
    artworkId,
    galleryId,
  }: {
    artworkId: string;
    galleryId: string;
  }): Promise<boolean> {
    const artworkValue = artworkId.includes(CollectionNames.Artwork)
      ? artworkId
      : `${CollectionNames.Artwork}/${artworkId}`;
    const galleryValue = galleryId.includes(CollectionNames.Galleries)
      ? galleryId
      : `${CollectionNames.Galleries}/${galleryId}`;

    const galleryEdgeQuery = `
      FOR edge IN ${EdgeNames.FROMGalleryToArtwork}
      FILTER edge._from == @galleryValue AND edge._to == @artworkValue
      RETURN edge
      `;

    const galleryEdgeData = {
      artworkValue,
      galleryValue,
    };

    try {
      const edgeCursor = await this.db.query(galleryEdgeQuery, galleryEdgeData);
      const confirmEdge = await edgeCursor.next();
      if (confirmEdge) {
        return true;
      }
      return false;
    } catch (error: any) {
      throw new Error('error confirming gallery artwork edge');
    }
  }

  private async getArtworkImage({key}: {key: string}): Promise<any> {
    const fullArtworkId = this.generateArtworkId({artworkId: key});
    const findGalleryKey = `
      LET doc = DOCUMENT(@key)
      RETURN {
        artworkImage: doc.artworkImage
      }
    `;

    try {
      const cursor = await this.db.query(findGalleryKey, {key: fullArtworkId});
      const artworkImage: Images = await cursor.next();
      return artworkImage;
    } catch (error) {
      throw new Error('error getting artwork image');
    }
  }

  private async getArtistFromArtworkId(
    artworkId: string,
  ): Promise<Node | null> {
    const fullArtworkId = artworkId.includes(`${CollectionNames.Artwork}`)
      ? artworkId
      : `${CollectionNames.Artwork}/${artworkId}`;

    const artistQuery = `
      WITH ${CollectionNames.ArtworkArtists} ${CollectionNames.Artwork}
      FOR artist IN OUTBOUND @fullArtworkId ${EdgeNames.FROMArtworkTOArtist}
      RETURN artist
      `;

    try {
      const cursor = await this.db.query(artistQuery, {fullArtworkId});
      const artist: Node = await cursor.next();
      return artist;
    } catch (error) {
      throw new Error('error getting artist');
    }
  }

  private async getMediumFromArtworkId(
    artworkId: string,
  ): Promise<Node | null> {
    const fullArtworkId = artworkId.includes(`${CollectionNames.Artwork}`)
      ? artworkId
      : `${CollectionNames.Artwork}/${artworkId}`;

    const mediumQuery = `
      WITH ${CollectionNames.ArtworkMediums} ${CollectionNames.Artwork}
      FOR medium IN OUTBOUND @fullArtworkId ${EdgeNames.FROMArtworkToMedium}
      RETURN medium
      `;

    try {
      const cursor = await this.db.query(mediumQuery, {fullArtworkId});
      const medium: Node = await cursor.next();
      return medium;
    } catch (error) {
      throw new Error('error getting medium');
    }
  }

  public async swapArtworkOrder({
    artworkId,
    order,
  }: {
    artworkId: string;
    order: string;
  }): Promise<ArtworkNode | null> {
    const artworkKey = this.generateArtworkId({artworkId});

    const swapArtworkOrderQuery = `
      LET artwork = DOCUMENT(@artworkKey)
      UPDATE artwork WITH {exhibitionOrder: @order} IN ${CollectionNames.Artwork}
      RETURN NEW
    `;
    try {
      const cursor = await this.db.query(swapArtworkOrderQuery, {
        artworkKey,
        order,
      });
      const artwork: ArtworkNode = await cursor.next();
      return artwork;
    } catch (error) {
      throw new Error('error getting medium');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public generateArtworkId({artworkId}: {artworkId: string}): string {
    return artworkId.includes(`${CollectionNames.Artwork}`)
      ? artworkId
      : `${CollectionNames.Artwork}/${artworkId}`;
  }

  // eslint-disable-next-line class-methods-use-this
  public determinePriceBucket(price: string): string {
    const defaultReturn = 'no-price';
    if (!price) {
      return defaultReturn;
    }

    const priceNum = parseInt(price);

    if (Number.isNaN(priceNum)) {
      return defaultReturn;
    }

    switch (true) {
      // these are random tranches, picked on a whim
      case priceNum >= 0 && priceNum <= 199:
        return 'price-under-199';
      case priceNum >= 200 && priceNum <= 999:
        return 'price-200-to-999';
      case priceNum >= 1000 && priceNum <= 4999:
        return 'price-1000-to-4999';
      case priceNum >= 5000 && priceNum <= 9999:
        return 'price-5000-to-9999';
      case priceNum >= 10000 && priceNum <= 49999:
        return 'price-10000-to-49999';
      case priceNum >= 50000:
        return 'price-over-50000';
      default:
        return defaultReturn;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public determineSizeBucket(dimensions: Dimensions): string {
    const defaultReturn = 'no-dimensions';
    if (!dimensions) {
      return defaultReturn;
    }

    const cmsToInchesConstant = 2.54;

    let area;

    if (dimensions.displayUnit.value === 'in') {
      area =
        Number(dimensions.heightIn.value) * Number(dimensions.widthIn.value);
    } else if (dimensions.displayUnit.value === 'cm') {
      area =
        Number(dimensions.heightCm.value) *
        cmsToInchesConstant *
        (Number(dimensions.widthIn.value) * cmsToInchesConstant);
    } else {
      return defaultReturn;
    }

    if (!area) {
      return defaultReturn;
    }

    switch (true) {
      // max set to 19 height, 13 width
      case area >= 0 && area <= 247:
        return 'small-size';
      // max set to 24 height, 20 width
      case area >= 248 && area <= 480:
        return 'medium-size';
      // set to 36 height, 22 width
      case area >= 481 && area <= 792:
        return 'large-size';
      // arbitrary size
      case area >= 793 && area <= 999:
        return 'extra-large-size';
      case area >= 1000:
        return 'overSized-size';
      default:
        return defaultReturn;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public determineYearBucket(yearString: string): string {
    const currentYear = new Date().getFullYear();
    const year = parseInt(yearString, 10);

    // Ensure the provided year is valid
    if (Number.isNaN(year) || year < 0) {
      return 'no-year-provided';
    }

    const difference = currentYear - year;

    if (difference <= 5) {
      return 'within-the-last-5-years';
    } else if (difference <= 10) {
      return '5-10-years-ago';
    } else if (difference <= 19) {
      return '10-19-years-ago';
    } else if (difference <= 50) {
      return '20-50-years-ago';
    } else {
      return '51+-years-ago';
    }
  }
}
