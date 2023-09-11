import { Exhibition } from '@darta/types';


export interface IExhibitionService {

    createExhibition({exhibition, userId, galleryId}: {exhibition: Exhibition, userId: string, galleryId: string}): Promise<Exhibition | void>
    createExhibitionToArtworkEdge({exhibitionId, artworkId} : {exhibitionId : string, artworkId: string}): Promise<boolean>
    deleteExhibitionToArtworkEdge ({exhibitionId, artworkId} : {exhibitionId : string, artworkId: string}): Promise<boolean>
    
    readExhibitionForGallery({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string}) : Promise<Exhibition | void>
    readExhibitionForUser({exhibitionId} : {exhibitionId: string}) : Promise<Exhibition | void>
    editExhibition({exhibition, galleryId}: {exhibition: Exhibition, galleryId: string}): Promise<Exhibition | void>
    listExhibitionForGallery({galleryId}: {galleryId : string}): Promise<Exhibition[] | void>

    deleteExhibition({exhibitionId, galleryId, deleteArtworks}: {exhibitionId: string, galleryId: string, deleteArtworks?: boolean}): Promise<boolean>

  }
  