import { Exhibition } from '@darta/types';


export interface IExhibitionService {

    createCollection({exhibition, userId, galleryId}: {exhibition: Exhibition, userId: string, galleryId: string}): Promise<Exhibition | void>
    readCollectionForGallery({exhibitionId} : {exhibitionId: string}) : Promise<Exhibition | void>
    readCollectionForUser({exhibitionId} : {exhibitionId: string}) : Promise<Exhibition | void>
    editCollection({exhibition, userId}: {exhibition: Exhibition, userId: string}): Promise<Exhibition | void>
    listCollectionForGallery({galleryId}: {galleryId : string}): Promise<Exhibition[] | void>

  }
  