import { Artwork } from '@darta-types';
import {Database} from 'arangojs';
import {inject, injectable} from 'inversify';

import {CollectionNames, EdgeNames} from '../config/collections';
import { ImageController } from '../controllers';
import { filterOutPrivateRecordsSingleObject } from '../middleware';
import {
  IEdgeService,
  IGalleryService,
  INodeService,
  IRecommenderService,
  IUserService,
} from './interfaces';

@injectable()
export class RecommenderService implements IRecommenderService {
  constructor(
    @inject('Database') private readonly db: Database,
    @inject('IEdgeService') private readonly edgeService: IEdgeService,
    @inject('INodeService') private readonly nodeService: INodeService,
    @inject('IGalleryService') private readonly galleryService: IGalleryService,
    @inject('ImageController')
    private readonly imageController: ImageController,
    @inject('IUserService') private readonly userService: IUserService
  ) {}
  
  public async generateArtworkToRecommend({
    uid,
    startNumber,
    endNumber
  } : {
    uid: string;
    startNumber: number;
    endNumber: number;
  }): Promise<{[key: string] : Artwork}> {
    const userId = this.userService.generateDartaUserId({uid});
    const ArtworkQuery = `
    WITH ${CollectionNames.Artwork}, ${CollectionNames.ArtworkArtists}, ${CollectionNames.Galleries}, ${CollectionNames.ArtworkMediums}
    LET allArtwork = (
      FOR art IN ${CollectionNames.Artwork}
      RETURN art._key
    )

    LET viewedArtworkByUser = (
      FOR edge IN ${EdgeNames.FROMDartaUserTOArtworkVIEWED}
      FILTER edge._from == @userId
      RETURN edge._to
    )

    LET notViewedByUserArtworkKeys = MINUS(allArtwork, viewedArtworkByUser)

    FOR key IN notViewedByUserArtworkKeys
      FOR art IN ${CollectionNames.Artwork}
        FILTER art._key == key
        LET artist = (
          FOR v, e IN 1..1 OUTBOUND art ${EdgeNames.FROMArtworkTOArtist}
          RETURN v
        )[0]
        LET medium = (
          FOR v, e IN 1..1 OUTBOUND art ${EdgeNames.FROMArtworkToMedium}
          RETURN v
        )[0]
      
        LET gallery = (
          FOR v, e IN 1..1 INBOUND art ${EdgeNames.FROMGalleryToArtwork}
          RETURN v
        )[0]
      
        LIMIT @limit
        RETURN {
          artwork: art,
          medium: medium.value,
          artistName: artist.value,
          galleryId: gallery._id
        }
    `

    try {
      const cursor = await this.db.query(ArtworkQuery, {userId, limit: endNumber});
      const artworks: any = await cursor.all();
      const processedData = artworks.map((item: any) => ({
          ...item.artwork,
          artistName: {value: item.artistName},
          galleryId: item.galleryId,
          artworkMedium: {value: item.medium}
        }));
      let counter = startNumber;
      const results: {[key: string]: Artwork} = {};
      for (const artwork of processedData) {
        results[counter.toString()] = filterOutPrivateRecordsSingleObject(artwork);
        counter+=1;
      }
      // console.log({results})
      return results;
    } catch (error: any) {
      throw new Error(error.message);
    }

  } 
}
