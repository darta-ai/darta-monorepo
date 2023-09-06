import { Artwork, IGalleryProfileData } from '@darta/types'
import { ArtworkNode } from 'src/models/models';

export type ArtworkAndGallery = {
  artwork: Artwork | null,
  gallery: IGalleryProfileData | null
}

export interface IArtworkService {
    createArtwork({artwork, galleryId} : {artwork: Artwork, galleryId: string}): Promise<void>;
    readArtwork(artworkId: string): Promise<Artwork | null>;
    readArtworkAndGallery(artworkId: string): Promise<ArtworkAndGallery | null>
    editArtwork({artwork} : {artwork: Artwork}): Promise<ArtworkNode | null>;
    deleteArtwork({artworkId} : {artworkId: string}): Promise<boolean>;
    confirmGalleryArtworkEdge(artworkId: string, galleryKey: string): Promise<boolean>;
    listArtworksByGallery({galleryId} : {galleryId: string}): Promise<(Artwork | null)[] | null>
  }
  