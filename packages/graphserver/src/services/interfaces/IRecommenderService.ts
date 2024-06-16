import { Artwork } from '@darta-types';


export interface IRecommenderService {
  generateArtworkToRecommend({
    uid,
    startNumber,
    endNumber
  } : {
    uid: string;
    startNumber: number;
    endNumber: number;
  }): Promise<{[key: string] : Artwork}>
  getRecommendationsRandomSampling({
    uid,
    startNumber,
    endNumber,
    artworkIds,
  } : {
    uid: string;
    startNumber: number;
    endNumber: number;
    artworkIds: string[];
  }): Promise<{[key: string] : Artwork}>

  collaborativeFilteringCollectRatings({
    uid,
    startNumber,
    endNumber
  } : {
    uid: string;
    startNumber: number;
    endNumber: number;
  }): Promise<{[key: string] : Artwork}>

  executeRecommendationQuery({
    uid, startNumber, endNumber
  } : {
    uid: string, startNumber: number, endNumber: number
  }): Promise<{[key: string]: Artwork}> 
  readArtworksToRecommend({uid, startNumber} : {uid: string, startNumber: number}): Promise<{[key: string] : Artwork}>
  generateAndSaveArtworkToRecommend({
    uid, startNumber, endNumber } : {uid: string, startNumber: number, endNumber: number}): Promise<{[key: string] : Artwork}>
  generateNewArtworksToRecommendBackfill({
    uid, generatedArtworks
  } : {uid: string, generatedArtworks: {[key: string] : Artwork}}): Promise<void>
}
