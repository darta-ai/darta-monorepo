import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import {Client} from 'minio'
import { IExhibitionService, INodeService, IEdgeService, IArtworkService,IGalleryService } from './interfaces';
import { Artwork, Exhibition, Images } from '@darta/types';
import { CollectionNames, EdgeNames } from 'src/config/collections';
import { ImageController } from 'src/controllers/ImageController';
import { newExhibitionShell } from 'src/config/templates';
import _ from 'lodash'
import { Edge } from 'arangojs/documents';

const BUCKET_NAME= "exhibitions"

@injectable()
export class ExhibitionService implements IExhibitionService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('IArtworkService') private readonly artworkService: IArtworkService,
    @inject('MinioClient') private readonly minio: Client,
    @inject('ImageController') private readonly imageController: ImageController,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService
    ) {}

    public async createExhibition({galleryId, userId}: { galleryId: string, userId: string}): Promise<Exhibition | void>{
      
      if (!galleryId || !userId){
        throw new Error("no gallery id or user id present")
      }

      const exhibition: Exhibition = _.cloneDeep(newExhibitionShell);
      exhibition.exhibitionId = crypto.randomUUID();
      exhibition.createdAt = new Date().toISOString();

      const exhibitionQuery = `
        INSERT @newExhibition INTO ${CollectionNames.Exhibitions} 
        RETURN NEW
      `

    let newExhibition

    try{
      const ExhibitionCursor = await this.db.query(exhibitionQuery, { newExhibition: {...exhibition, _key: exhibition?.exhibitionId, value: exhibition?.slug?.value}});
      newExhibition = await ExhibitionCursor.next();
    } catch (error: any){
      console.log(error)
    }

    try{
      await this.edgeService.upsertEdge({
        edgeName: EdgeNames.FROMGalleryTOExhibition,
        from: `${galleryId}`,
        to: newExhibition._id,
        data: {value : 'created'}
      })

    } catch (error: any){
      console.log(error)
    }

    return newExhibition
    }

    public async readExhibitionForGallery({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) : Promise<Exhibition | void>{
      const isValidated = await this.verifyGalleryOwnsExhibition({exhibitionId, galleryId})
      if (!isValidated) {
        throw new Error('Unauthorized')
      }

      return await this.getExhibitionById({exhibitionId})
    }

    public async readExhibitionForUser({exhibitionId} : {exhibitionId: string}) : Promise<Exhibition | void>{

    }

    public async editExhibition({exhibition, galleryId}: {exhibition: Exhibition, galleryId: string}): Promise<Exhibition | void> {

      const exhibitionId = exhibition?.exhibitionId;

      if (!exhibitionId){
        return 
      }

      const {artworks, exhibitionPrimaryImage, ...remainingExhibitionProps} = exhibition;


      // #########################################################################
      //                             SAVE THE EXHIBITION IMAGE 
      // #########################################################################


      const {exhibitionImage} = await this.getExhibitionImage({key: exhibitionId})

     // Don't overwrite an image
     let fileName:string = crypto.randomUUID()
     if (exhibitionImage?.exhibitionPrimaryImage?.fileName){
       fileName = exhibitionImage.exhibitionPrimaryImage.fileName
     }
 
     let bucketName = exhibitionPrimaryImage?.bucketName ?? null;
     let value = exhibitionPrimaryImage?.value ?? null;
     if (exhibitionPrimaryImage?.fileData){
       try{
         const artworkImageResults = await this.imageController.processUploadImage({fileBuffer: exhibitionPrimaryImage?.fileData, fileName, bucketName: BUCKET_NAME})
         ;({bucketName, value} = artworkImageResults)
       } catch (error){
         console.error("error uploading image:", error)
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
          fileName
        },
        updatedAt: new Date(),
      }

      let savedExhibition

      try{
        savedExhibition = await this.nodeService.upsertNodeByKey({collectionName: CollectionNames.Exhibitions, key: exhibitionId, data })
      } catch (error) {
        console.log('error saving artwork')
      }

      const returnExhibition: any = {
        ...savedExhibition
      }

      return returnExhibition;
    }

    public async getExhibitionById({exhibitionId} : {exhibitionId: string}): Promise <Exhibition | void> {

      const fullExhibitionId = this.generateExhibitionId({exhibitionId})

      const exhibitionQuery = `
      LET exhibition = DOCUMENT(@fullExhibitionId)
      RETURN exhibition      
      `

      // LOL terrible as 
      let exhibition : Exhibition = {} as Exhibition
      try {
        const cursor = await this.db.query(exhibitionQuery, {fullExhibitionId});
        exhibition = await cursor.next();
   
      } catch (error){
        console.log(error)
        
      }

      const exhibitionArtworks = await this.listAllExhibitionArtworks({exhibitionId})
      
      return {
        ...exhibition, 
        artworks: {
          ...exhibitionArtworks
        }
      }

    }
    
    public async listExhibitionForGallery({galleryId}: {galleryId : string}): Promise<Exhibition[] | void> {

      const getExhibitionsQuery = `
      WITH ${CollectionNames.Galleries}, ${CollectionNames.Exhibitions}
      FOR artwork IN OUTBOUND @galleryId ${EdgeNames.FROMGalleryTOExhibition}
      RETURN artwork._id      
    `;

      try{
        const edgeCursor = await this.db.query(getExhibitionsQuery, {galleryId});
        const exhibitionIds = (await edgeCursor.all()).filter((el) => el);

        const galleryOwnedArtworkPromises = exhibitionIds.map(async (exhibitionId : string) =>{
          return await this.getExhibitionById({exhibitionId})
        } )

        
        const galleryExhibitions = await Promise.all(galleryOwnedArtworkPromises);
        if (galleryExhibitions){
          return galleryExhibitions as Exhibition[]
        }
      } catch (error) {
        console.log(error)
        return []
      }

    }

    public async deleteExhibition({exhibitionId, galleryId, deleteArtworks}: {exhibitionId: string, galleryId: string, deleteArtworks?: boolean}): Promise<boolean> {
    
      const fullExhibitionId = this.generateExhibitionId({exhibitionId});
      const fullGalleryId = this.galleryService.generateGalleryId({galleryId});
    
      const isVerified = await this.verifyGalleryOwnsExhibition({exhibitionId, galleryId});
      if (!isVerified) {
        throw new Error('unable to verify exhibition is owned by gallery');
      }
    
      const exhibition = await this.getExhibitionById({exhibitionId});
      let artworks: {[key: string]: Artwork} = {};
    
      if(exhibition?.artworks) {
        artworks = exhibition.artworks as {[key:string]: Artwork};
      }
    
      const promises = [];
    
      // Handle artworks
      if (artworks) {
        const artworkArray = Object.values(artworks);
        
        artworkArray.forEach((artwork) => {
          // Delete artwork if required
          if (deleteArtworks && artwork?.artworkId) {
            promises.push(this.artworkService.deleteArtwork({artworkId: artwork.artworkId}));
          }
          
          // Delete exhibition to artwork edge
          promises.push(this.edgeService.deleteEdge({
            edgeName: EdgeNames.FROMGalleryTOExhibition,
            from: fullGalleryId,
            to: fullExhibitionId
          }));
    
        });
      }
    
      // Delete exhibition image
      if (exhibition?.exhibitionPrimaryImage?.fileName && exhibition?.exhibitionPrimaryImage?.bucketName) {
        const {fileName, bucketName} = exhibition.exhibitionPrimaryImage;
        promises.push(this.imageController.processDeleteImage({fileName, bucketName}));
      }
    
      // Delete gallery to Exhibition edge
      promises.push(this.edgeService.deleteEdge({
        edgeName: EdgeNames.FROMGalleryTOExhibition,
        from: fullGalleryId,
        to: fullExhibitionId
      }).catch(error => console.log('unable to delete edge', error))); // Catch here to allow other promises to complete
    
      // Delete exhibition
      promises.push(this.nodeService.deleteNode({
        collectionName: CollectionNames.Exhibitions,
        id: fullExhibitionId
      }).catch(error => console.log('unable to delete node', error))); // Catch here to allow other promises to complete
    
      // Wait for all promises to complete
      let results;
      try{
        results = await Promise.all(promises);
      }catch (error) {
        console.log(error)
      }

      if (results){
        return true
      }

      return false
    
      // You can further handle results if needed (e.g., check for errors)
    }
    

    private async getExhibitionImage({key}: {key:string}): Promise<any>{

      const findGalleryKey = `
      LET doc = DOCUMENT(CONCAT("${CollectionNames.Exhibitions}/", @key))
      RETURN {
        exhibitionPrimaryImage: doc.exhibitionPrimaryImage
      }
    `;

    try{
      const cursor = await this.db.query(findGalleryKey, { key });
      const exhibitionPrimaryImage: Images = await cursor.next();
      return {exhibitionPrimaryImage}
    }catch(error) {
      console.log(error)
    }
    }


    private async listAllExhibitionArtworks({exhibitionId} : {exhibitionId : string}): Promise<any>{

      const fullExhibitionId = this.generateExhibitionId({exhibitionId})

      let exhibitionArtworkIds;

      try {
        exhibitionArtworkIds = await this.edgeService.getAllEdgesFromNode({
          edgeName: EdgeNames.FROMCollectionTOArtwork,
          from: fullExhibitionId
        })
        
      } catch (error){
        console.log(error)
      }

      let artworkResults : Artwork[] = []
      if (exhibitionArtworkIds) {
        const artworkPromises = exhibitionArtworkIds.map(async (artwork: Edge) => {
          if (artwork) {
            try {
              return await this.artworkService.readArtwork(artwork._to!)
            } catch (error) {
              console.error("Error handling artwork:", artwork, error);
              // You can decide to either return null or some error object her
              return null
            }
          }
          return null
        });
        const results = await Promise.all(artworkPromises);
        artworkResults = results.filter((result) : result is Artwork => result !== null && result?.artworkId !== undefined)
      }

      return artworkResults.reduce((acc, artwork) => ({...acc, [artwork.artworkId as string] : artwork}), {})
    }

    public async createExhibitionToArtworkEdge({exhibitionId, artworkId} : {exhibitionId : string, artworkId: string}): Promise<boolean>{

      const fullExhibitionId = this.generateExhibitionId({exhibitionId})
      const fullArtworkId = this.artworkService.generateArtworkId({artworkId})

      try {
        await this.edgeService.upsertEdge({
          edgeName: EdgeNames.FROMCollectionTOArtwork, 
          from: fullExhibitionId,
          to: fullArtworkId,
          data:{
            value: 'SHOWS'
          }
        })
        return true
      } catch (error){
        console.log(error)
      }
      return false
    }

    public async deleteExhibitionToArtworkEdge ({exhibitionId, artworkId} : {exhibitionId : string, artworkId: string}): Promise<boolean>{

      const fullExhibitionId = this.generateExhibitionId({exhibitionId})
      const fullArtworkId = this.artworkService.generateArtworkId({artworkId})

      try {
        await this.edgeService.deleteEdge({
          edgeName: EdgeNames.FROMCollectionTOArtwork, 
          from: fullExhibitionId,
          to: fullArtworkId,
        })
        return true
      } catch (error){
        console.log(error)
      }
      return false
    }

    private async verifyGalleryOwnsExhibition({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}): Promise<boolean>{

      const to = this.generateExhibitionId({exhibitionId})
      const from = this.galleryService.generateGalleryId({galleryId})

      try{
        const results = await this.edgeService.getEdge({
          edgeName: EdgeNames.FROMGalleryTOExhibition,
          from, 
          to
        })
        if(results){
          return true
        }
      } catch (error) {
        console.log(error)
      }


      return false
    }

    private generateExhibitionId({exhibitionId}:{exhibitionId: string}): string {
      return exhibitionId.includes(`${CollectionNames.Exhibitions}`) ? exhibitionId : `${CollectionNames.Exhibitions}/${exhibitionId}`
    }
    
}


