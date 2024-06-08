import { Exhibition } from "@darta-types/dist";

export interface IScrapeService {
  // scrapeFromArtLogic({ url, galleryId, userId }: { url: string; galleryId: string, userId: string }): Promise<Exhibition | void>;
  generateArtworksFromArtLogicUrl({ 
    url, galleryId, userId, exhibitionId }: { url: string; galleryId: string; userId: string, exhibitionId: string }): Promise<Exhibition | void>;
}
