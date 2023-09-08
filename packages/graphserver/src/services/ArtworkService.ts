import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import { IArtworkService, INodeService, IGalleryService, IEdgeService } from './interfaces';
import { Artwork, Dimensions, Images } from '@darta/types';
import { ImageController } from 'src/controllers/ImageController';
import { CollectionNames, EdgeNames } from 'src/config/collections';
import { ArtworkNode, Edge } from 'src/models/models';
import { Node } from 'src/models/models';
import { ArtworkAndGallery } from './interfaces/IArtworkService';
import { newArtworkShell } from 'src/config/templates';
import _ from 'lodash';

const BUCKET_NAME = "artwork"

@injectable()
export class ArtworkService implements IArtworkService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('ImageController') private readonly imageController: ImageController,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService
    ) {}
    public async createArtwork({galleryId, exhibitionOrder = null} : {galleryId: string, exhibitionOrder?: number | null}): Promise<Artwork>{
      // create the artwork 

      const artwork: Artwork = _.cloneDeep(newArtworkShell);
      artwork.artworkId = crypto.randomUUID()
      artwork.createdAt = new Date().toISOString()
      artwork.updatedAt = new Date().toISOString()
      if (exhibitionOrder){
        artwork.exhibitionOrder = exhibitionOrder
      }

      if (!galleryId){
        throw new Error("no gallery id present")
      }

      const artworkQuery = `
        INSERT @newArtwork INTO ${CollectionNames.Artwork} 
        RETURN NEW
      `
      let newArtwork;

      try{
        const createArtworkCursor = await this.db.query(artworkQuery, { newArtwork: {...artwork, _key: artwork.artworkId}});
        newArtwork = await createArtworkCursor.next();
      } catch (error: any){
        console.log(error)
      }

      // create the edge between the gallery and the artwork

        try{
          await this.edgeService.upsertEdge({
            edgeName: EdgeNames.FROMGalleryToArtwork,
            from: `${galleryId}`,
            to: newArtwork._id,
            data: {value : 'created'}
          })
        } catch (error: any){
          console.log(error)
        }

      return newArtwork
    }

    public async readArtwork(artworkId: string): Promise<Artwork | null>{
      // TO-DO: build out? 
      const artwork = await this.getArtworkById(artworkId)

      return artwork
    }

    public async readArtworkAndGallery(artworkId: string): Promise<ArtworkAndGallery>{
      // TO-DO: build out? 
      const artwork = await this.getArtworkById(artworkId)

      // ############## get gallery ##############

      let galleryEdge: Edge;
      let gallery = null

      if(artwork?._id){
        galleryEdge = await this.edgeService.getEdgeWithTo({
          edgeName: EdgeNames.FROMGalleryToArtwork,
          to: artwork._id
        })
        gallery = await this.galleryService.readGalleryProfileFromGalleryId({galleryId : galleryEdge._from})
      }
      return {artwork, gallery}
    }
    public async editArtwork({artwork} : {artwork: Artwork}): Promise<ArtworkNode | null> {

        const artworkId = artwork?.artworkId

        if (!artworkId){
          return null 
        }

        const {artworkImage, artworkMedium, artworkPrice, artworkDimensions, artistName, artworkCreatedYear, ...remainingArtworkProps} = artwork
        const artworkKey = `${CollectionNames.Artwork}/${artworkId}`


        // #########################################################################
        //                             SAVE THE ARTWORK IMAGE 
        // #########################################################################

        const {currentArtworkImage} = await this.getArtworkImage({key: artworkId})

        // Don't overwrite an image
        let fileName:string = crypto.randomUUID()
        if (currentArtworkImage?.artworkImage?.fileName){
          fileName = currentArtworkImage.artworkImage.fileName
        }
    
        let bucketName = artworkImage?.bucketName ?? null;
        let value = artworkImage?.value ?? null;
        if (artworkImage?.fileData){
          try{
            const artworkImageResults = await this.imageController.processUploadImage({fileBuffer: artworkImage?.fileData, fileName, bucketName: BUCKET_NAME})
            ;({bucketName, value} = artworkImageResults)
          } catch (error){
            console.error("error uploading image:", error)
          }
        } 


        // #########################################################################
        //                              SAVE THE ARTWORK 
        //                        Including the Bucketed Stuff 
        // #########################################################################



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
            fileName
          }
        }

        let savedArtwork

        try{
          savedArtwork = await this.nodeService.upsertNodeByKey({collectionName: CollectionNames.Artwork, key: artworkId, data })
        } catch (error) {
          console.log('error saving artwork')
        }

        const returnArtwork: any = {
          ...savedArtwork
        }

        //augment return DTO

        

        // #########################################################################
        //                                  Artist
        // #########################################################################
        


        // create/get artwork Artist node
        const artistNodePayload = {
          collectionName: CollectionNames.ArtworkArtists,
          data: {
            value: artistName.value
          }
        }

        let artistNodeResults;
        try {
          artistNodeResults = await this.nodeService.upsertNodeByKey(artistNodePayload)
        }catch(error){
          console.log('artist NODE results error')
        }

        // augment return DTO
        returnArtwork.artistName = {
          value: artistNodeResults?.value ?? null
        }

        // create artwork Artist edge
        if (artworkId && artistNodeResults?._id){
          const artistEdgePayload = {
            edgeName: EdgeNames.FROMArtworkTOArtist,
            from: artworkKey, 
            newTo: artistNodeResults?._id,
            data: {
              value: 'ARTIST'
            }
          }

          let artistEdgeResults;
          try {
            artistEdgeResults = await this.edgeService.replaceMediumEdge(artistEdgePayload)
          } catch (error){
            console.log('artist EDGE results error')
          }
        }

        // #########################################################################
        //                                Artwork medium
        // #########################################################################


        // create/get artwork medium node
        const mediumValue = artworkMedium?.value
        const mediumNodePayload = {
          collectionName: CollectionNames.ArtworkMediums,
          data: {
            value: mediumValue
          }
        }

        let mediumNodeResults;
        try {
          mediumNodeResults = await this.nodeService.upsertNodeByKey(mediumNodePayload)
        }catch(error){
          console.log('medium NODE results error')
        }


        // augment return DTO
        returnArtwork.artworkMedium = {
          value: mediumNodeResults?.value ?? null
        }

        // create artwork medium edge
        
        if (artworkId && mediumNodeResults?._id){
          const mediumEdgePayload = {
            edgeName: EdgeNames.FROMArtworkToMedium,
            from: artworkKey, 
            newTo: mediumNodeResults?._id,
            data: {
              value: 'USES'
            }
          }
  
          let mediumEdgeResults;
          try {
            mediumEdgeResults = await this.edgeService.replaceMediumEdge(mediumEdgePayload)
          } catch (error){
            // console.log(error)
            console.log('medium EDGE results error')
          }
        }

        // #########################################################################
        //                           Artwork price (bucket)
        // #########################################################################
        let priceBucket = "no-price"
        if (artworkPrice?.value){
          priceBucket = this.determinePriceBucket(artworkPrice.value);
        }
        // create/get artwork price node
        const priceNodePayload = {
          collectionName: CollectionNames.ArtworkPriceBuckets,
          data: {
            value: priceBucket
          }
        }

        let priceNodeResults;
        try {
          priceNodeResults = await this.nodeService.upsertNodeByKey(priceNodePayload)
        }catch(error){
          console.log('price NODE results error')
        }

        // create artwork price edge
        if (artworkId && priceNodeResults?._id){
          const priceEdgePayload = {
            edgeName: EdgeNames.FROMArtworkTOCostBucket,
            from: artworkKey, 
            newTo: priceNodeResults?._id,
            data: {
              value: 'COST'
            }
          }

          let priceEdgeResults;
          try {
            priceEdgeResults = await this.edgeService.replaceMediumEdge(priceEdgePayload)
          } catch (error){
            console.log('price EDGE results error')
          }
        }

        // #########################################################################
        //                             Artwork size (bucket)
        // #########################################################################

        let sizeBucket = 'no-dimensions'
        if (artworkDimensions?.text){
          sizeBucket = this.determineSizeBucket(artworkDimensions)
        }

        // create/get artwork price node
        const sizeNodePayload = {
            collectionName: CollectionNames.ArtworkSizeBuckets,
            data: {
              value: sizeBucket
            }
          }
  
          let sizeNodeResults;
          try {
            sizeNodeResults = await this.nodeService.upsertNodeByKey(sizeNodePayload)
          }catch(error){
            console.log('size NODE results error')
          }

          // create artwork price edge
          if (artworkId && sizeNodeResults?._id){
            const sizeEdgePayload = {
              edgeName: EdgeNames.FROMArtworkTOSizeBucket,
              from: artworkKey, 
              newTo: sizeNodeResults?._id,
              data: {
                value: 'SIZE'
              }
            }
  
            let sizeEdgeResults;
            try {
              sizeEdgeResults = await this.edgeService.replaceMediumEdge(sizeEdgePayload)
            } catch (error){
              console.log('size EDGE results error')
            }
          }

        // #########################################################################
        //                              YEAR (bucket)
        // #########################################################################
        


        // create/get artwork YEAR node
        
        let year = 'no-year-provided'
        if (artworkCreatedYear?.value){
          year = this.determineYearBucket(artworkCreatedYear.value)
        }
        const yearNodePayload = {
          collectionName: CollectionNames.ArtworkCreatedBuckets,
          data: {
            value: year
          }
        }

        let yearNodeResults;
        try {
          yearNodeResults = await this.nodeService.upsertNodeByKey(yearNodePayload)
        }catch(error){
          console.log('year NODE results error')
        }

        // create artwork YEAR edge
        if (artworkId && yearNodeResults?._id){
          const yearEdgePayload = {
            edgeName: EdgeNames.FROMArtworkTOCreateBucket,
            from: artworkKey, 
            newTo: yearNodeResults?._id,
            data: {
              value: 'YEAR CREATED'
            }
          }

          let yearEdgeResults;
          try {
            yearEdgeResults = await this.edgeService.replaceMediumEdge(yearEdgePayload)
          } catch (error){
            console.log('year YEAR results error')
          }
        }
 
        return returnArtwork
      
    }

    public async deleteArtwork({artworkId} : {artworkId: string}): Promise<boolean>{

      const artwork = await this.getArtworkById(artworkId)

      if (!artwork){
        return false
      }

      const key = `${CollectionNames.Artwork}/${artworkId}`

      // #########################################################################
      //                             DELETE THE ARTWORK IMAGE 
      // #########################################################################

      const {artworkImage} = artwork

      if (artworkImage.bucketName && artworkImage.fileName){
        try{
          await this.imageController.processDeleteImage({fileName : artworkImage.fileName, bucketName: artworkImage.bucketName})
        } catch {
          console.log('error in deleting artwork image')
          return false
        }
      }


      // #########################################################################
      //                               Gallery Edge
      // #########################################################################
      
      try{
        await this.edgeService.deleteEdgeWithTo({
          edgeName: EdgeNames.FROMGalleryToArtwork,
          to: key
        })
      } catch(error){
        console.log('error deleting artist edge')
      }


      // #########################################################################
      //                               Artist Edge
      // #########################################################################
      
      try{
        await this.edgeService.deleteEdgeWithFrom({
          edgeName: EdgeNames.FROMArtworkTOArtist,
          from: key
        })
      } catch(error){
        console.log('error deleting artist edge')
      }


      // #########################################################################
      //                                Artwork medium
      // #########################################################################

      try{
        await this.edgeService.deleteEdgeWithFrom({
          edgeName: EdgeNames.FROMArtworkToMedium,
          from: key
        })
      } catch(error){
        console.log('error deleting medium edge')
      }


      // #########################################################################
      //                           Artwork price (bucket)
      // #########################################################################
     

      try{
        await this.edgeService.deleteEdgeWithFrom({
          edgeName: EdgeNames.FROMArtworkTOCostBucket,
          from: key
        })
      } catch(error){
        console.log('error deleting price bucket edge')
      }


      // #########################################################################
      //                             Artwork size (bucket)
      // #########################################################################

      try{
        await this.edgeService.deleteEdgeWithFrom({
          edgeName: EdgeNames.FROMArtworkTOSizeBucket,
          from: key
        })
      } catch(error){
        console.log('error deleting artist edge')
      }

      // #########################################################################
      //                              YEAR (bucket)
      // #########################################################################
      
      try{
        await this.edgeService.deleteEdgeWithFrom({
          edgeName: EdgeNames.FROMArtworkTOCreateBucket,
          from: key
        })
      } catch(error){
        console.log('error deleting year edge')
      }

      // #########################################################################
      //                              DELETE THE ARTWORK 
      //                        Including the Bucketed Stuff 
      // #########################################################################

      try {
        await this.nodeService.deleteNode({
          collectionName: CollectionNames.Artwork, 
          id: key
        })
        console.log('triggered')
      } catch (error) {
        console.log(error)
        return false
      }
      


      return true

    }

    public async listArtworksByGallery({galleryId} : {galleryId: string}): Promise<(Artwork | null)[] | null>{

      const getArtworksQuery = `
      WITH ${CollectionNames.Galleries}, ${CollectionNames.Artwork}
      FOR artwork IN OUTBOUND @galleryId ${EdgeNames.FROMGalleryToArtwork}
      RETURN artwork._id      
    `;

      try{
        const edgeCursor = await this.db.query(getArtworksQuery, {galleryId});
        const artworkIds = (await edgeCursor.all()).filter((el) => el);

        const galleryOwnedArtworkPromises = artworkIds.map(async (artworkId : string) =>{
          return await this.getArtworkById(artworkId)
        } )

        
        const galleryOwnedArtwork = await Promise.all(galleryOwnedArtworkPromises);
        return galleryOwnedArtwork
      } catch (error) {
        console.log(error)
        return []
      }
    }

    public async getArtworkById(artworkId: string): Promise<Artwork | null>{

      const fullArtworkId = artworkId.includes('Artwork/') ? artworkId : `${CollectionNames.Artwork}/${artworkId}`

      const artworkQuery = `
      LET artwork = DOCUMENT(@artworkId)
      RETURN artwork      
      `

      let artwork : Artwork;

      try{
        const edgeCursor = await this.db.query(artworkQuery, {artworkId: fullArtworkId});
        artwork = await edgeCursor.next();
      } catch (error) {
        return null
      }


      // ################# Get Artist ############### 
      let artistNameNode: Node | null = null

      try {
        artistNameNode = await this.getArtistFromArtworkId(fullArtworkId)
      } catch (error) {
        console.log(error)
      }

      // ################# Get Medium ############### 
      let mediumNameNode: Node | null = null

      try {
        const results = await this.getMediumFromArtworkId(fullArtworkId)
        if (results){
          mediumNameNode = results
        }

      } catch (error) {
        console.log(error)
      }

      // ################# Artwork Image ############### 

        return {
          ...artwork, 
          artworkMedium: {
            value: mediumNameNode?.value ?? ''
          }, 
          artistName: {
            value : artistNameNode?.value ?? ''
          }
        }
    }

    public async confirmGalleryArtworkEdge({artworkId, galleryId} : {artworkId: string, galleryId: string}): Promise<boolean> {

      const artworkValue = artworkId.includes(CollectionNames.Artwork) ? artworkId : `${CollectionNames.Artwork}/${artworkId}`
      const galleryValue = galleryId.includes(CollectionNames.Galleries) ? galleryId : `${CollectionNames.Galleries}/${galleryId}`


      const galleryEdgeQuery = `
      FOR edge IN ${EdgeNames.FROMGalleryToArtwork}
      FILTER edge._from == @galleryValue AND edge._to == @artworkValue
      RETURN edge
      `

      const galleryEdgeData = {
        artworkValue,
        galleryValue
      }

      try{
        const edgeCursor = await this.db.query(galleryEdgeQuery, galleryEdgeData);
        const confirmEdge = await edgeCursor.next();
        if (confirmEdge){
          return true
        }
        return false
      } catch (error: any){
        console.log(error)
        return false
      }
    }

    private async getArtworkImage({key}: {key:string}): Promise<any>{

      const findGalleryKey = `
      LET doc = DOCUMENT(CONCAT("Artwork/", @key))
      RETURN {
        artworkImage: doc.artworkImage
      }
    `;

    try{
      const cursor = await this.db.query(findGalleryKey, { key });
      const artworkImage: Images = await cursor.next();
      return {artworkImage}
    }catch(error) {
      console.log(error)
    }
    }


    private async getArtistFromArtworkId (artworkId: string): Promise<Node | null>{

      const fullArtworkId = artworkId.includes(`${CollectionNames.Artwork}`) ? artworkId : `${CollectionNames.Artwork}/${artworkId}`

      const artistQuery = `
      WITH ${CollectionNames.ArtworkArtists} ${CollectionNames.Artwork}
      FOR artist IN OUTBOUND @fullArtworkId ${EdgeNames.FROMArtworkTOArtist}
      RETURN artist
      `

      try {
        const cursor = await this.db.query(artistQuery, {fullArtworkId});
        const artist: Node = await cursor.next();
        return artist
      } catch (error){
        console.log(error)
        return null
      }
    }


    private async getMediumFromArtworkId (artworkId: string): Promise<Node | null>{

      const fullArtworkId = artworkId.includes(`${CollectionNames.Artwork}`) ? artworkId : `${CollectionNames.Artwork}/${artworkId}`


      const mediumQuery = `
      WITH ${CollectionNames.ArtworkMediums} ${CollectionNames.Artwork}
      FOR medium IN OUTBOUND @fullArtworkId ${EdgeNames.FROMArtworkToMedium}
      RETURN medium
      `

      try{
        const cursor = await this.db.query(mediumQuery, {fullArtworkId});
        const medium: Node = await cursor.next();
        return medium
      } catch (error) {
        // TO-DO 
        console.log(error)
        return null
      }
    }

    public generateArtworkId({artworkId}:{artworkId: string}): string {
      return artworkId.includes(`${CollectionNames.Artwork}`) ? artworkId : `${CollectionNames.Artwork}/${artworkId}`
    }
    

    public determinePriceBucket(price: string): string{
      const defaultReturn = 'no-price'
      if (!price){
        return defaultReturn
      }

      const priceNum = parseInt(price);

      if (isNaN(priceNum)){
        return defaultReturn
      }

      switch (true) {
          // these are random tranches, picked on a whim
          case (priceNum >= 0 && priceNum <= 199):
              return "price-under-199"
          case (priceNum >= 200 && priceNum <= 999):
              return "price-200-to-999"
          case (priceNum >= 1000 && priceNum <= 4999):
              return "price-1000-to-4999"
          case (priceNum >= 5000 && priceNum <= 9999):
            return "price-5000-to-9999"
          case (priceNum >= 10000 && priceNum <= 49999):
              return "price-10000-to-49999"
          case (priceNum >= 50000):
              return "price-over-50000"
          default:
            return defaultReturn
      }

    }

    public determineSizeBucket(dimensions: Dimensions): string{

      const defaultReturn = 'no-dimensions'
      if (!dimensions){
        return defaultReturn
      }

      const cmsToInchesConstant = 2.54

      let area;

      if (dimensions.displayUnit.value === 'in'){
        area = Number(dimensions.heightIn.value) * Number(dimensions.widthIn.value)
      } else if (dimensions.displayUnit.value === 'cm'){
        area = (Number(dimensions.heightCm.value) * cmsToInchesConstant) * (Number(dimensions.widthIn.value) * cmsToInchesConstant) 
      }else{
        return defaultReturn
      }

      if (!area){
        return defaultReturn
      }

      switch (true) {
        // max set to 19 height, 13 width
          case (area >= 0 && area <= 247):
              return "small-size"
        // max set to 24 height, 20 width
          case (area >= 248 && area <= 480):
              return "medium-size"
        // set to 36 height, 22 width
          case (area >= 481 && area <= 792):
              return "large-size"
        // arbitrary size
          case (area >= 793 && area <= 999):
            return "extra-large-size"
          case (area >= 1000):
              return "overSized-size"
          default:
            return defaultReturn
      }
    }

    public determineYearBucket(yearString: string): string {

      const currentYear = new Date().getFullYear();
      const year = parseInt(yearString, 10);

      // Ensure the provided year is valid
      if (isNaN(year) || year < 0) {
        return 'no-year-provided'
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


