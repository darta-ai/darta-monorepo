import { injectable, inject } from 'inversify';
import { Database } from 'arangojs';
import {Client} from 'minio'
import { IExhibitionService, INodeService, IEdgeService} from './interfaces';
import { Exhibition } from '@darta/types';
import { CollectionNames, EdgeNames } from 'src/config/collections';


const BUCKET_NAME= "exhibitions"

@injectable()
export class CollectionService implements IExhibitionService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('MinioClient') private readonly minio: Client,
    @inject('INodeService') private readonly nodeService: INodeService,
    ) {}

    public async createCollection({exhibition, galleryId, userId}: {exhibition: Exhibition, galleryId: string, userId: string}): Promise<Exhibition | void>{

      if (!galleryId || !userId){
        throw new Error("no gallery id or user id present")
      }

      const exhibitionQuery = `
        INSERT @newExhibition INTO ${CollectionNames.Exhibitions} 
        RETURN NEW
      `

    let newExhibition

    try{
      const collectionCursor = await this.db.query(exhibitionQuery, { newExhibition: {...exhibition, _key: exhibition?.exhibitionId}});
      newExhibition = await collectionCursor.next();
    } catch (error: any){
      console.log(error)
    }

    if (newExhibition?._id){
      try{
       await this.edgeService.upsertEdge({
          edgeName: EdgeNames.FROMGalleryTOExhibition,
          from: `${galleryId}`,
          to: newExhibition._id,
          data: {value : 'uploaded'}
        })

      } catch (error: any){
        console.log(error)
      }
    }


    }

    public async readCollectionForGallery({exhibitionId} : {exhibitionId: string}) : Promise<Exhibition | void>{

    }

    public async readCollectionForUser({exhibitionId} : {exhibitionId: string}) : Promise<Exhibition | void>{

    }

    public async editCollection({exhibition, userId}: {exhibition: Exhibition, userId: string}): Promise<Exhibition | void> {

    }
    
    public async listCollectionForGallery({galleryId}: {galleryId : string}): Promise<Exhibition[] | void> {

      const getExhibitionsQuery = `
      WITH ${CollectionNames.Galleries}, ${CollectionNames.Exhibitions}
      FOR artwork IN OUTBOUND @galleryId ${EdgeNames.FROMGalleryTOExhibition}
      RETURN artwork._id      
    `;

      // try{
      //   const edgeCursor = await this.db.query(getExhibitionsQuery, {galleryId});
      //   const artworkIds = (await edgeCursor.all()).filter((el) => el);

      //   const galleryOwnedArtworkPromises = artworkIds.map(async (artworkId : string) =>{
      //     return await this.getArtworkById(artworkId)
      //   } )

        
      //   const galleryOwnedArtwork = await Promise.all(galleryOwnedArtworkPromises);
      //   return galleryOwnedArtwork
      // } catch (error) {
      //   console.log(error)
      //   return []
      // }

    }

    
}


