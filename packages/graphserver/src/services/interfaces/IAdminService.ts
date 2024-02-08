import { Artwork, Exhibition, ExhibitionPreviewAdmin } from "@darta-types"

import { Gallery } from "../../models/GalleryModel"

export type DynamicTemplateData = {
  artworkTitle: string
  artistName: string
  galleryName: string 
  userFirstName: string
  userLastName: string
  userEmail: string
}

export interface IAdminService {
  validateAndCreateCollectionsAndEdges(): Promise<void>;
  addApprovedGallerySDL(sdl: string): Promise<string>;
  addMinioBucker(bucketName: string): Promise<string>;
  listAllExhibitionsForAdmin(): Promise<ExhibitionPreviewAdmin[]>;
  getGalleryForAdmin({galleryId} : {galleryId: string}): Promise<Gallery | null>

  createExhibitionForAdmin({galleryId, userId }: { galleryId: string; userId: string }): Promise<Exhibition | void>
  editExhibitionForAdmin({ exhibition, galleryId }: {exhibition: Exhibition, galleryId: string }): Promise<Exhibition | void>
  publishExhibitionForAdmin({exhibitionId, galleryId, isPublished} : 
    {exhibitionId: string, galleryId: string, isPublished: boolean}): Promise<Exhibition | void>
  createArtworkForAdmin({ galleryId, exhibitionOrder, exhibitionId }: 
    { galleryId: string; exhibitionOrder?: number | null; exhibitionId?: string | null}): Promise<Artwork>
  listGalleryExhibitionsForAdmin({galleryId }: { galleryId: string }): Promise<Exhibition[] | void>
}
