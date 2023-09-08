import { Exhibition } from '@darta/types';


export interface IExhibitionService {

    createExhibition({exhibition, userId, galleryId}: {exhibition: Exhibition, userId: string, galleryId: string}): Promise<Exhibition | void>
    createExhibitionToArtworkEdge({exhibitionId, artworkId} : {exhibitionId : string, artworkId: string}): Promise<boolean>
    deleteExhibitionToArtworkEdge ({exhibitionId, artworkId} : {exhibitionId : string, artworkId: string}): Promise<boolean>
    
    readExhibitionForGallery({exhibitionId} : {exhibitionId: string}) : Promise<Exhibition | void>
    readExhibitionForUser({exhibitionId} : {exhibitionId: string}) : Promise<Exhibition | void>
    editExhibition({exhibition, galleryId}: {exhibition: Exhibition, galleryId: string}): Promise<Exhibition | void>
    listExhibitionForGallery({galleryId}: {galleryId : string}): Promise<Exhibition[] | void>

    deleteExhibitionAndArtwork({exhibitionId}: {exhibitionId: string}): Promise<void>
    deleteExhibitionOnly({exhibitionId}: {exhibitionId: string}): Promise<void>

  }
  