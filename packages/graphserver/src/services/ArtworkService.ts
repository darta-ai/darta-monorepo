import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import { IArtworkService, INodeService } from './interfaces';
import { Artwork, Dimensions } from '@darta/types';
import { ImageController } from 'src/controllers/ImageController';
import { Gallery } from 'src/models/GalleryModel';
import { CollectionNames, EdgeNames } from 'src/config/collections';
import { IEdgeService } from './';

const BUCKET_NAME= "artwork"

@injectable()
export class ArtworkService implements IArtworkService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('ImageController') private readonly imageController: ImageController,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService
    ) {}
    public async createArtwork({artwork, galleryId} : {artwork: Artwork, galleryId: string}): Promise<void>{
      // create the artwork 

      if (!galleryId){
        throw new Error("no gallery id present")
      }

      const artworkQuery = `
        INSERT @newArtwork INTO ${CollectionNames.Artwork} 
        RETURN NEW
      `

      let newArtwork

      try{
        const collectionCursor = await this.db.query(artworkQuery, { newArtwork: {...artwork, _key: artwork.artworkId}});
        newArtwork = await collectionCursor.next();
      } catch (error: any){
        console.log(error)
      }

      // create the edge between the gallery and the artwork

      if (newArtwork?._id){
        try{
          const upsertEdgePayload = {
            edgeName: EdgeNames.GalleryShowsArtwork,
            from: `${CollectionNames.Galleries}/${galleryId}`,
            to: newArtwork._id,
            data: {value : 'created'}
          }
          this.edgeService.upsertEdge({...upsertEdgePayload})
        } catch (error: any){
          console.log(error)
        }
      }

      return newArtwork
    }
    public async readArtwork(artworkId: string): Promise<Artwork | null>{
      return null
    }
    public async editArtwork({artwork, galleryId} : {artwork: Artwork, galleryId: string}): Promise<Artwork | null>{


        // #########################################################################
        //                                Artwork medium
        // #########################################################################

        // create/get artwork medium node
        const mediumValue = artwork?.artworkMedium?.value
        const mediumNodePayload = {
          collectionName: CollectionNames.ArtworkMediums,
          data: {
            value: mediumValue
          }
        }

        let mediumNodeResults;
        try {
          mediumNodeResults = await this.nodeService.upsertNode(mediumNodePayload)
        }catch(error){
          console.log('medium NODE results error')
        }

        // create artwork medium edge
        const artworkId = artwork?.artworkId
        if (artworkId && mediumNodeResults?._id){
          const mediumEdgePayload = {
            edgeName: EdgeNames.ArtworkUsesMedium,
            from: `${CollectionNames.Artwork}/${artworkId}`, 
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
        //                                Artwork price
        // #########################################################################
        const {artworkPrice} = artwork
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
          priceNodeResults = await this.nodeService.upsertNode(priceNodePayload)
        }catch(error){
          console.log('price NODE results error')
        }

        // create artwork price edge
        if (artworkId && priceNodeResults?._id){
          const priceEdgePayload = {
            edgeName: EdgeNames.ArtworkCosts,
            from: `${CollectionNames.Artwork}/${artworkId}`, 
            newTo: priceNodeResults?._id,
            data: {
              value: 'COST'
            }
          }

          let priceEdgeResults;
          try {
            priceEdgeResults = await this.edgeService.replaceMediumEdge(priceEdgePayload)
          } catch (error){
            // console.log(error)
            console.log('medium EDGE results error')
          }
        }


        let sizeBucket = 'no-dimensions'
        if (artwork.artworkDimensions.text){
          sizeBucket = this.determineSizeBucket(artwork.artworkDimensions)
        }
        
        // Bind variables:
        const bindVars = {
          artworkId: artwork.artworkId,
          artworkDetails : {
            ...artwork
          },
          galleryId: galleryId,
          priceBucket,
          dimensionsValue: sizeBucket,
          artistName: artwork?.artistName?.value,
          mediumName: artwork?.artworkMedium?.value,
          yearCreated: artwork?.artworkCreatedYear?.value ?? "no-creation-year"

          
        };

 
        return null

        // create edge and node between the medium and the artwork
        // const artworkMediumQuery = `UPSERT { name: @mediumName }
        // INSERT { name: @mediumName }
        // UPDATE {}
        // IN ${CollectionNames.ArtworkMediums}
        // RETURN NEW
        // `


      // let medium
      // try{
      //   const mediumCursor = await this.db.query(artworkMediumQuery, {mediumName: bindVars.mediumName});
      //   medium = await mediumCursor.next();
      //   console.log({medium})
      // } catch (error) {
      //   //TO-DO
      // }
      
      // const mediumEdgeQuery = `
      // INSERT {
      //   _from: CONCAT("${CollectionNames.Artwork}/", @artworkId),
      //   _to: @mediumId,
      //   value: "uses"
      // } INTO ${EdgeNames.ArtworkUsesMedium}
      // `

      // try{
      //   const mediumEdgeCursor = await this.db.query(mediumEdgeQuery, {artworkId: bindVars.artworkId, mediumId: medium._id });
      //   const mediumEdge = await mediumEdgeCursor.next();
      //   console.log({mediumEdge})
      // } catch (error) {
      //   console.log(error)
      // }

  
      
    }
    public async deleteGalleryProfile(artworkId: string): Promise<void>{
      return 
    }

    public async getArtworkById(artworkId: string): Promise<Artwork | null>{

      const artworkQuery = `
      LET artwork = DOCUMENT(@artworkId)
      RETURN artwork      
      `

      const bindVars = {
        artworkId: `${CollectionNames.Artwork}/${artworkId}`
      }

      try{
        const edgeCursor = await this.db.query(artworkQuery, {bindVars});
        const artwork = await edgeCursor.next();
        return artwork
      } catch (error) {
        return null
      }
    }

    public async confirmGalleryArtworkEdge(artworkId: string, galleryKey: string): Promise<boolean>{

      const galleryEdgeQuery = `
      FOR edge IN ${EdgeNames.GalleryShowsArtwork}
      FILTER edge._from == CONCAT("${CollectionNames.Galleries}/", @galleryKey) AND edge._to == CONCAT("${CollectionNames.Artwork}/", @artworkId)
      RETURN edge
      `

      const galleryEdgeData = {
        galleryKey, 
        artworkId: artworkId
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

    private determinePriceBucket(price: string): string{

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

    private determineSizeBucket(dimensions: Dimensions): string{

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
}


