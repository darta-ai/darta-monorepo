/* eslint-disable class-methods-use-this */
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
    const count = endNumber - startNumber;
    const ArtworkQuery = `
    WITH ${CollectionNames.Artwork}, 
    ${CollectionNames.ArtworkArtists}, 
    ${CollectionNames.Galleries}, 
    ${CollectionNames.ArtworkMediums}, 
    ${CollectionNames.Exhibitions}
    LET allArtwork = (
      FOR art IN ${CollectionNames.Artwork}
      SORT RAND()
      FILTER art.published == true AND art.artworkDimensions.depthIn.value == '' OR art.artworkDimensions.depthIn.value == null
      RETURN art._key
    )

    LET ratedArtworkByUserSAVE = (
      FOR edge IN ${EdgeNames.FROMDartaUserTOArtworkSAVE}
      FILTER edge._from == @userId
      RETURN edge._to
    )

    LET ratedArtworkByUserLIKE = (
      FOR edge IN ${EdgeNames.FROMDartaUserTOArtworkLIKE}
      FILTER edge._from == @userId
      RETURN edge._to
    )

    LET ratedArtworkByUserDISLIKE = (
      FOR edge IN ${EdgeNames.FROMDartaUserTOArtworkDISLIKE}
      FILTER edge._from == @userId
      RETURN edge._to
    )

    LET notViewedByUserArtworkKeys = MINUS(allArtwork, ratedArtworkByUserLIKE, ratedArtworkByUserSAVE, ratedArtworkByUserDISLIKE)

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

        LET exhibition = (
          FOR v, e IN 1..1 INBOUND art ${EdgeNames.FROMCollectionTOArtwork}
          RETURN v
        )[0]
      
        LIMIT @limit, @count
        RETURN {
          artwork: art,
          medium: medium.value,
          artistName: artist.value,
          galleryId: gallery._id,
          exhibitionId: exhibition._id
        }
    `

    try {
      const cursor = await this.db.query(ArtworkQuery, {userId, limit: endNumber, count});
      const artworks: any = await cursor.all();
       // Shuffle and organize artworks here
       const groupedArtworks = this.groupArtworksByExhibition(artworks);
       Object.keys(groupedArtworks).forEach(exhibitionId => {
         groupedArtworks[exhibitionId] = this.shuffleArray(groupedArtworks[exhibitionId]);
       });
       
       const variedArtworks = this.pickVariedArtworks(groupedArtworks, count);
       
       // Process varied artworks into the desired format
       const results: {[key: string]: Artwork} = {};
       variedArtworks.forEach((artwork, index) => {
         const resultKey = (startNumber + index).toString();
         results[resultKey] = filterOutPrivateRecordsSingleObject(artwork);
       });

      return results;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i-=1) {
      const j = Math.floor(Math.random() * (i + 1));
      // eslint-disable-next-line no-param-reassign
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private groupArtworksByExhibition(artworks: any[]): {[exhibitionId: string]: any[]} {
    const groupedArtworks: {[exhibitionId: string] : Artwork[]} = {};
    artworks.forEach(item => {
      const {exhibitionId} = item;
      if (!groupedArtworks[exhibitionId]) {
        groupedArtworks[exhibitionId] = [];
      }
      groupedArtworks[exhibitionId].push({
        ...item.artwork,
        artistName: {value: item.artistName},
        galleryId: item.galleryId,
        artworkMedium: {value: item.medium},
        exhibitionId: item.exhibitionId
      });
    });
    return groupedArtworks;
  }

  private pickVariedArtworks(groupedArtworks: {[exhibitionId: string]: any[]}, count: number): any[] {
    const pickedArtworks: Artwork[] = [];
    const exhibitionIds = Object.keys(groupedArtworks);

    while (pickedArtworks.length < count) {
      exhibitionIds.forEach(exhibitionId => {
        if (groupedArtworks[exhibitionId] && groupedArtworks[exhibitionId].length > 0) {
          pickedArtworks.push(groupedArtworks[exhibitionId].shift());
        }
      });
      if (exhibitionIds.every(exhibitionId => groupedArtworks[exhibitionId].length === 0)) {
        break; // break the loop if all arrays are empty
      }
    }
    return pickedArtworks;
  }

}
