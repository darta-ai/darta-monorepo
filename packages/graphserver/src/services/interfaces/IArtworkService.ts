import { Artwork, IGalleryProfileData, Dimensions } from '@darta/types'
import { ArtworkNode } from 'src/models/models';

export type ArtworkAndGallery = {
  artwork: Artwork | null,
  gallery: IGalleryProfileData | null
}

export interface IArtworkService {
    createArtwork({galleryId, exhibitionOrder} : {galleryId: string, exhibitionOrder?: number | null}): Promise<Artwork>;
    readArtwork(artworkId: string): Promise<Artwork | null>;
    readArtworkAndGallery(artworkId: string): Promise<ArtworkAndGallery | null>
    editArtwork({artwork} : {artwork: Artwork}): Promise<ArtworkNode | null>;
    deleteArtwork({artworkId} : {artworkId: string}): Promise<boolean>;
    confirmGalleryArtworkEdge({artworkId, galleryId} : {artworkId: string, galleryId: string}): Promise<boolean> 
    listArtworksByGallery({galleryId} : {galleryId: string}): Promise<(Artwork | null)[] | null>
    
    generateArtworkId({artworkId}:{artworkId: string}): string
    determinePriceBucket(price: string): string
    determineSizeBucket(dimensions: Dimensions): string
    determineYearBucket(yearString: string): string
  }
  