import { Artwork } from '@darta/types'
import { ArtworkNode } from 'src/models/models';

export interface IArtworkService {
    createArtwork({artwork, galleryId} : {artwork: Artwork, galleryId: string}): Promise<void>;
    readArtwork(artworkId: string): Promise<Artwork | null>;
    editArtwork({artwork} : {artwork: Artwork}): Promise<ArtworkNode | null>;
    deleteGalleryProfile(artworkId: string): Promise<void>;
    confirmGalleryArtworkEdge(artworkId: string, galleryKey: string): Promise<boolean>;
    getArtworksByGallery({galleryId} : {galleryId: string}): Promise<string[]>;
  }
  