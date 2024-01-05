import {Artwork, Dimensions, IGalleryProfileData, Images, PreviewArtwork} from '@darta-types';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';
import _ from 'lodash';

import {CollectionNames, EdgeNames} from '../config/collections';
import { ENV } from '../config/config';
import {newArtworkShell, standardConsoleLog} from '../config/templates';
import {ImageController} from '../controllers/ImageController';
import {ArtworkNode, Edge, Node} from '../models/models';
import {
  IAdminService,
  IArtworkService,
  IEdgeService,
  IGalleryService,
  INodeService,
  IUserService} from './interfaces';
import { DynamicTemplateData } from './interfaces/IAdminService';

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
    @inject('IUserService') private readonly userService: IUserService,
    @inject('IAdminService') private readonly adminService: IAdminService,
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
      throw new Error('error creating artwork at createArtwork');
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
      throw new Error('error creating artwork edge at createArtwork');
    }

    return newArtwork;
  }

  // eslint-disable-next-line consistent-return
  public async createUserArtworkRelationship({
    uid,
    action,
    artworkId,
  }: {
    uid: string;
    action: 'LIKE' | 'DISLIKE' | 'SAVE' | 'INQUIRE' | 'VIEWED';
    artworkId: string;
  }): Promise<void> {
    try {
      const userId = this.userService.generateDartaUserId({uid});
      const artId = this.generateArtworkId({artworkId});
      const edgeKey = `FROMDartaUserTOArtwork${action}`;
      const data: any = {
        value: action,
        createdAt: new Date().toISOString(),
      }
      const userIsInquiring = action === 'INQUIRE';
      if (userIsInquiring) {
        data.status = 'inquired'
      }
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames[edgeKey as keyof typeof EdgeNames],
        from: userId,
        to: artId,
        data,
        });
         
        if (userIsInquiring){
          await this.sendInquiryEmail({artworkId, userId})
        }
    } catch (error: any) {
      return error.message;
    }
  }

  public async readArtwork(artworkId: string): Promise<Artwork | null> {
    // TO-DO: build out?
    const artwork = await this.getArtworkById(artworkId);

    return artwork;
  }

  public async readArtworkPreview({artworkId}: {artworkId: string}): Promise<PreviewArtwork | null> {
    // TO-DO: build out?
    const artwork = await this.getArtworkById(artworkId);

    if (!artwork || !artwork._id) throw new Error('no artwork found at readArtworkPreview')

    return {
      _id: artwork._id,
      artworkTitle: artwork.artworkTitle,
      artworkImage: {value: artwork.artworkImage?.value},
      artistName: artwork.artistName,
      addedAt: new Date().toISOString()
    };
  }

  public async readArtworkForList(
    artworkId: string,
  ): Promise<Artwork> {
    // TO-DO: build out?
    try {
      const artwork = await this.getArtworkById(artworkId);

      if (!artwork){
        throw new Error('no artwork found at readArtworkAndGalleryForList')
      }
  
      return artwork
    } catch (error){
      throw new Error('error reading artwork and gallery at readArtworkAndGallery')
    }
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
      artworkCategory,
      artworkStyleTags,
      artworkVisualTags,
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
      } catch (error: any) {
        throw new Error(`error uploading image at editArtwork: ${error?.message}`);
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
    } catch (error: any) {
      throw new Error(`error saving artwork at editArtwork: ${error?.message}`);
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

    // artworkStyleTags
    let styleTagPromises: any[] = [];
    if (artworkStyleTags?.length) {
      styleTagPromises = artworkStyleTags.map(tag =>
        this.nodeService.upsertNodeByKey({
          collectionName: CollectionNames.ArtworkStyleTags,
          data: {value: tag},
        }),
      );
    }

    // artworkVisualTags
    let visualTagPromises: any[] = [];
    if (artworkVisualTags?.length) {
      visualTagPromises = artworkVisualTags.map(tag =>
        this.nodeService.upsertNodeByKey({
          collectionName: CollectionNames.ArtworkVisualTags,
          data: {value: tag},
        }),
      );
    }

    // artworkCategory
    let categoryPromise;
    if (artworkCategory?.value) {
      categoryPromise = this.nodeService.upsertNodeByKey({
        collectionName: CollectionNames.ArtworkCategories,
        data: {value: artworkCategory.value},
      });
    }



    // Execute node promises in parallel
    const [artistNode, mediumNode, priceNode, sizeNode, yearNode, categoryNode] =
      await Promise.all([
        artistPromise,
        mediumPromise,
        pricePromise,
        sizePromise,
        yearPromise,
        categoryPromise
      ]);

    const styleTagNode = await Promise.all(styleTagPromises)

    const visualTagNode = await Promise.all(visualTagPromises)
  

    // Handle edge creations

    const edgesToCreate = [];    

    if (artworkId && artistNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOArtist,
        from: artworkKey,
        to: artistNode._id,
        data: {
          value: 'ARTIST',
        },
      });
    }

    if (artworkId && mediumNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkToMedium,
        from: artworkKey,
        to: mediumNode._id,
        data: {
          value: 'USES',
        },
      });
    }

    if (artworkId && priceNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOCostBucket,
        from: artworkKey,
        to: priceNode._id,
        data: {
          value: 'COST',
        },
      });
    }

    if (artworkId && sizeNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOSizeBucket,
        from: artworkKey,
        to: sizeNode._id,
        data: {
          value: 'SIZE',
        },
      });
    }

    if (artworkId && yearNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOCreateBucket,
        from: artworkKey,
        to: yearNode._id,
        data: {
          value: 'YEAR CREATED',
        },
      });
    }

    if (categoryPromise && categoryNode?._id) {
      edgesToCreate.push({
        edgeName: EdgeNames.FROMArtworkTOCategory,
        from: artworkKey,
        to: categoryNode._id,
        data: {
          value: 'CATEGORY',
        },
      });
    }
    
    const edgePromises = edgesToCreate.map(edge =>
      this.edgeService.upsertEdge(edge),
    );
    try{
      await Promise.all(edgePromises);
    } catch (error: any) {
      throw new Error (`error creating edges at editArtwork: ${error?.message}`)
    }

    const tagEdgesToCreate = [];

    if (styleTagNode?.length) {
      const styleTagEdgePromises = styleTagNode.map(tag => ({
        from: artworkKey,
        to: tag._id,
        data: {
          value: 'STYLE TAG',
        },
      }))
      tagEdgesToCreate.push(...styleTagEdgePromises)
    }


    const visualEdgesToCreate = [];

    if (visualTagNode?.length) {
      const visualTagEdgePromises = visualTagNode.map(tag => ({
        edgeName: EdgeNames.FROMArtworkTOVisualTag,
        from: artworkKey,
        to: tag._id,
        data: {
          value: 'VISUAL TAG',
        },
      }))
      visualEdgesToCreate.push(...visualTagEdgePromises)
    }

    try{
      await this.edgeService.validateAndCreateEdges({
        edgeName: EdgeNames.FROMArtworkTOStyleTag,
        from: artworkKey,
        edgesToCreate: tagEdgesToCreate
      })  
      await this.edgeService.validateAndCreateEdges({
        edgeName: EdgeNames.FROMArtworkTOVisualTag,
        from: artworkKey,
        edgesToCreate: visualEdgesToCreate
      })
    } catch (error: any) {
      throw new Error (`error creating edges at editArtwork: ${error?.message}`)
    }

    return {
      ...savedArtwork,
      artistName: {value: artistNode?.value ?? null},
      artworkMedium: {value: mediumNode?.value ?? null},
      artworkPrice,
      artworkCategory: {value: categoryNode?.value ?? null},
      artworkCreatedYear,
      artworkStyleTags, 
      artworkVisualTags
    };
  }

  public async editArtworkInquiry({
    edgeId, 
    status
  }: {
    edgeId: string;
    status: string;
  }) : Promise<Edge | void>{
    try{
      const query = `
      FOR doc IN ${EdgeNames.FROMDartaUserTOArtworkINQUIRE}
      FILTER doc._id == @edgeId
      UPDATE doc WITH { status: @status } IN ${EdgeNames.FROMDartaUserTOArtworkINQUIRE}
      RETURN doc
      `

      const edgeCursor = await this.db.query(query, {edgeId, status});
      const res = await edgeCursor.next()
      return res
    }catch(error:any){
      throw new Error(`error editing artwork inquiry at editArtworkInqury: ${error?.message}`)
    }
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
        throw new Error('error deleting artwork image: deleteArtwork');
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
      throw new Error('error deleting gallery edge: deleteArtwork');
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

    // Artwork Style Tags

    edgesToDelete.push({
      edgeName: EdgeNames.FROMArtworkTOStyleTag,
      from: key,
    });

    // Artwork Visual Tags

    edgesToDelete.push({
      edgeName: EdgeNames.FROMArtworkTOVisualTag,
      from: key,
    });

    // Artwork Category

    edgesToDelete.push({
      edgeName: EdgeNames.FROMArtworkTOCategory,
      from: key,
    });

    if (artwork.exhibitionId) {
      await this.edgeService.deleteEdge({
        edgeName: EdgeNames.FROMCollectionTOArtwork,
        from: artwork.exhibitionId.includes(CollectionNames.Exhibitions) ? 
        artwork.exhibitionId : `${CollectionNames.Exhibitions}/${artwork.exhibitionId}`,
        to: key,
      });
    }

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


  // eslint-disable-next-line consistent-return
  public async deleteUserArtworkRelationship({
    uid,
    action,
    artworkId,
  }: {
    uid: string;
    action: 'LIKE' | 'DISLIKE' | 'SAVE' | 'INQUIRE' | 'VIEWED';
    artworkId: string;
  }): Promise<void> {
    try {
      const userId = this.userService.generateDartaUserId({uid});
      const artId = this.generateArtworkId({artworkId});
      const edgeKey = `FROMDartaUserTOArtwork${action}`;
      await this.edgeService.deleteEdge({
        edgeName: EdgeNames[edgeKey as keyof typeof EdgeNames],
        from: userId,
        to: artId
      });
         
    } catch (error: any) {
      return error.message;
    }
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
        async (artworkId: string) => this.getArtworkById(artworkId),
      );

      const galleryOwnedArtwork = await Promise.all(
        galleryOwnedArtworkPromises,
      );
      return galleryOwnedArtwork;
    } catch (error) {
      throw new Error('error getting artworks at listArtworksByGallery');
    }
  }

  public async listArtworkInquiresByGallery({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<any> {
    const getArtworksQuery = `
    WITH ${CollectionNames.Artwork}, ${CollectionNames.Galleries}, ${EdgeNames.FROMGalleryToArtwork}, ${CollectionNames.DartaUsers}, ${EdgeNames.FROMDartaUserTOArtworkINQUIRE}
      FOR gallery IN ${CollectionNames.Galleries}
      FILTER gallery._id == @galleryId 
      FOR artwork IN 1..1 OUTBOUND gallery ${EdgeNames.FROMGalleryToArtwork}
      FOR user, edge IN 1..1 INBOUND artwork ${EdgeNames.FROMDartaUserTOArtworkINQUIRE}
      RETURN {
        legalFirstName: user.legalFirstName,
        legalLastName: user.legalLastName,
        email: user.email,
        artwork_id: artwork._id,
        createdAt: edge.createdAt,
        updatedAt: edge.updatedAt,
        status: edge.status, 
        edge_id: edge._id
      }
    `;

    try {
      const edgeCursor = await this.db.query(getArtworksQuery, {galleryId});
      const dartaUsers = (await edgeCursor.all()).filter(el => el);
      const dartaUsersObj = dartaUsers.reduce((acc: any, user: any) => {
        acc[user.artworkId] = user;
        return acc;
      }
      , {})
      return dartaUsersObj;
    } catch (error: any) {
      throw new Error(`error getting artworks at listArtworksByGallery: ${error?.message}`);
    }
  }

  public async listUserRelationshipArtworkByLimit({
    uid,
    limit,
    action,
  }: {
    uid: string;
    limit: number;
    action: string
  }): Promise<{[key: string] : Artwork}>{
    try {
      const userId = this.userService.generateDartaUserId({uid});
      const edgeKey = `FROMDartaUserTOArtwork${action}`;
      const edgeName = EdgeNames[edgeKey as keyof typeof EdgeNames];
      const edgeCursor = await this.db.query(`
      WITH ${CollectionNames.DartaUsers}, ${CollectionNames.Artwork}, ${EdgeNames.FROMArtworkTOArtist}, ${CollectionNames.ArtworkArtists}
      FOR artwork, edge IN OUTBOUND @userId @edgeName
          FOR artist IN OUTBOUND artwork ${EdgeNames.FROMArtworkTOArtist}
          SORT edge.date DESC
          LIMIT 0, @limit
          RETURN {
              artwork,
              artistName: artist.value
          }
      `, {userId, edgeName, limit});
      const artworks = await edgeCursor.all();
      const mergedArray = artworks.map(item => ({
        ...item.artwork,
        artistName: {value: item.artistName}
      }))
      const artworkMap = mergedArray.reduce((acc: any, artwork: Artwork) => {
        acc[artwork?._id as string] = artwork;
        return acc;
      }, {});
      return artworkMap;
    } catch (error) {
      throw new Error('error getting artworks');
    }
  }

  public async getArtworkById(artworkId: string): Promise<Artwork | null> {
    const fullArtworkId = artworkId.includes('Artwork/')
      ? artworkId
      : `${CollectionNames.Artwork}/${artworkId}`;

    const artworkQuery = `
    WITH ${CollectionNames.Artwork}, ${CollectionNames.ArtworkArtists}, ${CollectionNames.ArtworkMediums}, ${CollectionNames.ArtworkCategories}, ${CollectionNames.ArtworkStyleTags}, ${CollectionNames.ArtworkVisualTags}
    FOR artwork IN ${CollectionNames.Artwork}
      FILTER artwork._id == @artworkId
      LET artist = (
          FOR v, e IN 1..1 OUTBOUND artwork ${EdgeNames.FROMArtworkTOArtist}
          RETURN v
      )[0]
      LET medium = (
          FOR v, e IN 1..1 OUTBOUND artwork ${EdgeNames.FROMArtworkToMedium}
          RETURN v
      )[0]
      LET visualTags = (
        FOR v, e IN 1..1 OUTBOUND artwork ${EdgeNames.FROMArtworkTOVisualTag}
        RETURN v
      )
      LET styleTags = (
        FOR v, e IN 1..1 OUTBOUND artwork ${EdgeNames.FROMArtworkTOStyleTag}
        RETURN v
      )
      LET category = (
        FOR v, e IN 1..1 OUTBOUND artwork ${EdgeNames.FROMArtworkTOCategory}
        RETURN v
      )[0]
    RETURN {
        art: artwork,
        artist: artist.value,
        medium: medium.value,
        visualTags: visualTags,
        styleTags: styleTags,
        category: category.value
    }`;

    let artwork: Artwork;

    let result;
    try {
      const edgeCursor = await this.db.query(artworkQuery, {
        artworkId: fullArtworkId,
      });
      result = await edgeCursor.next();
      const {art, artist, medium, visualTags, styleTags, category} = result
      
      let artworkVisualTags;
      if (visualTags.length){
        artworkVisualTags = visualTags.map((el: any) => el?.value)
      }


      let artworkStyleTags;
      if (visualTags.length){
        artworkStyleTags = styleTags.map((el: any) => el?.value)
      }

      artwork = {
        ...art,
        artistName: {value: artist},
        artworkMedium: {value: medium},
        artworkVisualTags,
        artworkStyleTags,
        artworkCategory: {value: category}
      }

    } catch (error) {
      return null;
    }

    const {artworkImage} = artwork;

    let shouldRegenerate;
    if (artworkImage?.value) {
      shouldRegenerate = await this.imageController.shouldRegenerateUrl({url: artworkImage.value})
    }
    let artworkImageValue = artworkImage.value;

    if(shouldRegenerate && artworkImage?.bucketName && artworkImage?.fileName){
      try {
        artworkImageValue = await this.imageController.processGetFile({
          fileName: artworkImage.fileName,
          bucketName: artworkImage.bucketName,
        });
        if (artworkImageValue && ENV === 'production'){
          await this.refreshArtworkImage({artworkId, url: artworkImageValue})
        }
      } catch (error) {
        throw new Error('error getting artwork image');
      }
    }

    return {
      ...artwork,
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

  private async sendInquiryEmail({artworkId, userId}: {artworkId: string, userId: string}){

    const artwork = await this.getArtworkById(artworkId)
    const user = await this.userService.readDartaUser({uid: userId})
    let gallery: IGalleryProfileData = {} as IGalleryProfileData
    if (artwork?.galleryId){
      const results = await this.galleryService.readGalleryProfileFromGalleryId({galleryId: artwork?.galleryId})
      if (results){
        gallery = results
      }
    } else{
      const query = `
      WITH ${CollectionNames.Artwork}, ${CollectionNames.Galleries}, ${EdgeNames.FROMGalleryToArtwork}
      FOR artwork IN ${CollectionNames.Artwork}
      FILTER artwork._id == @artworkId
      FOR gallery IN 1..1 INBOUND artwork ${EdgeNames.FROMGalleryToArtwork}
      RETURN gallery
      `
      const cursor = await this.db.query(query, {artworkId})
      gallery = await cursor.next()
    }

    if (gallery?.galleryInternalEmail?.value 
      && user?.email 
      && gallery.galleryName.value 
      && artwork?.artworkTitle?.value 
      && artwork?.artistName?.value){
      const dynamicTemplateData: DynamicTemplateData = {
        artworkTitle: artwork?.artworkTitle?.value,
        artistName: artwork?.artistName?.value,
        userFirstName: user.legalFirstName ?? "",
        userLastName: user.legalLastName ?? "",
        userEmail: user.email,
        galleryName: gallery.galleryName.value,
      }
    try{
      await this.adminService.sgSendEmailInquireTemplate({
        to: gallery?.galleryInternalEmail?.value, 
        from: 'tj@darta.art',
        dynamicTemplateData
      })
    }catch(error: any){
      standardConsoleLog({request: 'ArtworkService', data: 'sendInquiryEmail', message: error?.message})
    }
  } else {
    const missingData = {
      galleryEmail: gallery?.galleryInternalEmail?.value,
      user: user?.email,
      galleryName: gallery.galleryName.value,
      artworkTitle: artwork?.artworkTitle?.value,
      artistName: artwork?.artistName?.value
    }

    standardConsoleLog({
      request: 'ArtworkService', 
      data: 'sendInquiryEmail', 
      message: `did not have necessary data for email request ${JSON.stringify({missingData})}`
  })
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

  public async refreshArtworkImage({
    artworkId,
    url,
  }: {
    artworkId: string;
    url: string;
  }): Promise<void> {
    const exhibitId = this.generateArtworkId({artworkId});

    try {
      await this.nodeService.upsertNodeById({
        collectionName: CollectionNames.Artwork,
        id: exhibitId,
        data: {
          artworkImage: {
            value: url
          },
        },
      });
    } catch (error) {
      throw new Error('unable to refresh gallery image');
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

    const priceNum = parseInt(price, 10);

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
    } if (difference <= 10) {
      return '5-10-years-ago';
    } if (difference <= 19) {
      return '10-19-years-ago';
    } if (difference <= 50) {
      return '20-50-years-ago';
    } 
      return '51+-years-ago';
    
  }
}
