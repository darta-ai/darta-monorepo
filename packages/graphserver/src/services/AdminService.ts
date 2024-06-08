import { Artwork, Exhibition, ExhibitionPreviewAdmin } from '@darta-types/dist';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';
import {Client} from 'minio';

import {CollectionNames, EdgeNames} from '../config/collections';
import { Gallery } from '../models/GalleryModel'
import {IAdminService, IArtworkService, IExhibitionService} from './interfaces';

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('MinioClient') private readonly minio: Client,
    @inject('IExhibitionService') private readonly exhibitionService: IExhibitionService,
    @inject('IArtworkService') private readonly artworkService: IArtworkService,
  ) {}

  public async validateAndCreateCollectionsAndEdges(): Promise<void> {
    const collectionNames = Object.values(CollectionNames);
    const edgeNames = Object.values(EdgeNames);
    collectionNames.map(async collectionName => {
      await this.ensureCollectionExists(collectionName);
      
    });

    edgeNames.map(async edgeName => {
      await this.ensureEdgeExists(edgeName);
    });
  }

  // METHOD NOT IMPLEMENTED
  // eslint-disable-next-line class-methods-use-this
  public async approveGalleryById(galleryId: string): Promise<string> {
    
    return galleryId
  }

  public async addMinioBucker(bucketName: string): Promise<string> {
    try {
      await this.minio.makeBucket(bucketName);
      return `added ${bucketName}`;
    } catch (error: any) {
      throw new Error(`failed to add ${bucketName}: ${error.message}`);
    }
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
    } 
      return `failed to add ${sdl}`;
    
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

  public async listAllExhibitionsForAdmin(): Promise<ExhibitionPreviewAdmin[]> {
    try {

      const getExhibitionPreviewQuery = `
      WITH ${CollectionNames.Exhibitions}, ${CollectionNames.Galleries}, ${CollectionNames.Artwork}
      LET exhibitions = (
        FOR exhibition IN ${CollectionNames.Exhibitions}
        SORT exhibition.exhibitionDates.exhibitionStartDate.value DESC
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
              LIMIT 2
              RETURN {
                  [artwork._id]: {
                      _id: artwork._id,
                      artworkImage: artwork.artworkImage,
                      artworkTitle: artwork.artworkTitle
                  }
              }
          )
          
      RETURN {
          exhibitionId: exhibition._id,
          isPublished: exhibition.isPublished,
          hasArtwork: LENGTH(artworks) > 0,
          galleryId: gallery._id,
          exhibitionDuration: exhibition.exhibitionDates,
          openingDate: {value: exhibition.exhibitionDates.exhibitionStartDate.value},
          closingDate: {value: exhibition.exhibitionDates.exhibitionEndDate.value},
          galleryName: gallery.galleryName,
          galleryWebsite: gallery.galleryWebsite,
          exhibitionTitle: exhibition.exhibitionTitle,
          exhibitionLocation: {
              exhibitionLocationString: exhibition.exhibitionLocation.locationString,
              coordinates: exhibition.exhibitionLocation.coordinates
          },
          receptionDates: exhibition.receptionDates
      }
      `
      const cursor = await this.db.query(getExhibitionPreviewQuery);
      const results = await cursor.all();
      
      // filter out duplicate exhibitions by location 
      const filteredResults = results.filter((exhibition, index, self) => 
        index === self.findIndex((t) => (
          t.exhibitionLocation.exhibitionLocationString.value === exhibition.exhibitionLocation.exhibitionLocationString.value
        ))
      )

      return filteredResults;
    } catch (error: any) {
      throw new Error(`failed to list all exhibitions: ${error.message}`);
    }
  }

  public async getGalleryForAdmin({galleryId} : {galleryId: string}): Promise<Gallery | null>{
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

    const results = {
      ...gallery,
    };
    // await this.reSaveGalleryImageByGalleryId({id: results.galleryId})
    return results
  }

  public async getExhibitionForGallery({exhibitionId}: {exhibitionId: string}): Promise<Exhibition | void>{
    return this.exhibitionService.readExhibitionForGallery({exhibitionId});
  }



  public async createExhibitionForAdmin({galleryId, userId}: { galleryId: string; userId: string }): Promise<Exhibition | void>{
    return this.exhibitionService.createExhibition({galleryId, userId});
  }

  public async editExhibitionForAdmin({ exhibition, galleryId }: {exhibition: Exhibition, galleryId: string }): Promise<Exhibition | void>{
    return this.exhibitionService.editExhibition({exhibition, galleryId});
  }

  public async publishExhibitionForAdmin({ exhibitionId, galleryId, isPublished }: 
    { exhibitionId: string; galleryId: string; isPublished: boolean; }): Promise<void | Exhibition> {
    return await this.exhibitionService.publishExhibition({exhibitionId, galleryId, isPublished});
  }

  public async createArtworkForAdmin({ galleryId, exhibitionOrder, exhibitionId }: 
    { galleryId: string; exhibitionId: string; exhibitionOrder?: number | null }): Promise<Artwork>{
      try{
        let order;
        if (!exhibitionOrder){
          const exhibition = await this.exhibitionService.readExhibitionForGallery({exhibitionId})
          if (exhibition && exhibition.artworks && exhibition.artworks.length){
            // eslint-disable-next-line no-unsafe-optional-chaining
            order = Number(exhibition.artworks?.length) + 1;
          }
        }
        return this.artworkService.createArtwork({galleryId, exhibitionOrder: exhibitionOrder || order, exhibitionId});
      } catch(error: any){
        throw new Error(error.message);
      }
  }

  createExhibitionToArtworkEdgeWithExhibitionOrder({exhibitionId, artworkId}:
    {exhibitionId: string; artworkId: string }): Promise<string>{
    return this.exhibitionService.createExhibitionToArtworkEdgeWithExhibitionOrder({exhibitionId, artworkId});
    }
  
  public async editArtworkForAdmin({artwork}: {artwork: Artwork}): Promise<Artwork | null>{
    try{
      if (!artwork._id){
        throw new Error('Artwork ID is required');
      }
      const res = await this.artworkService.editArtwork({artwork});
      if (!res){
        throw new Error('Unable to edit artwork');
      } else {
        return res;
      }

    } catch (error: any){
      throw new Error(error.message);
    }
  }
    
  public async listGalleryExhibitionsForAdmin({galleryId }: { galleryId: string }): Promise<Exhibition[] | void>{
    try{
      return this.exhibitionService.listExhibitionForGallery({galleryId});
    } catch (error: any){
      throw new Error(error.message);
    }
  }

  public async reOrderExhibitionArtworkForAdmin({artworkId, exhibitionId, desiredIndex, currentIndex}:
    {artworkId: string; exhibitionId: string; desiredIndex: number; currentIndex: number}): Promise<void>{
      await this.exhibitionService.reOrderExhibitionArtwork({artworkId, exhibitionId, desiredIndex, currentIndex});
       
    }
  
  public async listAllExhibitionArtworksForAdmin({exhibitionId}: {exhibitionId: string}): Promise<Artwork[] | null>{
    try{
      return this.exhibitionService.listAllExhibitionArtworks({exhibitionId});
    } catch (error: any){
      throw new Error(error.message);
    }
  }

  public async deleteExhibitionArtworkForAdmin({ artworkId, exhibitionId }: {artworkId: string, exhibitionId: string}): Promise<Exhibition | void>{
    try{
      await this.artworkService.deleteArtwork({artworkId});
      await this.exhibitionService.reOrderExhibitionToArtworkEdgesAfterDelete({exhibitionId});
      return await this.exhibitionService.readExhibitionForGallery({exhibitionId});
    } catch (error: any){
    throw new Error(error.message);
    }
  }
  
  public async deleteExhibitionForAdmin({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}): Promise<void>{
    try{
      await this.exhibitionService.deleteExhibition({exhibitionId, galleryId});
      
    } catch (error: any){
      throw new Error(error.message);
    }
  }
  
}
