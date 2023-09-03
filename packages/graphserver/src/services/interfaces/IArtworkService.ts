import { Artwork } from '@darta/types'

export interface IArtworkService {
    createArtwork({artwork, galleryId} : {artwork: Artwork, galleryId: string}): Promise<void>;
    readArtwork(artworkId: string): Promise<Artwork | null>;
    editArtwork({artwork, galleryId} : {artwork: Artwork, galleryId: string}): Promise<Artwork | null>;
    deleteGalleryProfile(artworkId: string): Promise<void>;
    confirmGalleryArtworkEdge(artworkId: string, galleryKey: string): Promise<boolean>;
  }
  