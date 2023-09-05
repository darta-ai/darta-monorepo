import { Artwork } from '@darta/types'
import { ArtworkNode } from 'src/models/models';

export interface IArtworkService {
    createArtwork({artwork, galleryId} : {artwork: Artwork, galleryId: string}): Promise<void>;
    readArtwork(artworkId: string): Promise<Artwork | null>;
    editArtwork({artwork} : {artwork: Artwork}): Promise<ArtworkNode | null>;
    deleteArtwork({artworkId} : {artworkId: string}): Promise<boolean>;
    confirmGalleryArtworkEdge(artworkId: string, galleryKey: string): Promise<boolean>;
    listArtworksByGallery({galleryId} : {galleryId: string}): Promise<(Artwork | null)[] | null>
  }
  