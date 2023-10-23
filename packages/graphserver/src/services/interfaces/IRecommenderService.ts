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
}
