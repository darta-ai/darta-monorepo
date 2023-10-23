import {Artwork, Dimensions, IGalleryProfileData} from '@darta-types';
import { Edge } from 'arangojs/documents';

import {ArtworkNode} from '../../models/models';

export type ArtworkAndGallery = {
  artwork: Artwork | null;
  gallery: IGalleryProfileData | null;
};

export interface IArtworkService {
  createArtwork({
    galleryId,
    exhibitionOrder,
    exhibitionId,
  }: {
    galleryId: string;
    exhibitionOrder?: number | null;
    exhibitionId?: string | null;
  }): Promise<Artwork>;
  createUserArtworkRelationship({
    uid,
    action,
    artworkId,
  }: {
    uid: string;
    action: string;
    artworkId: string;
  }): Promise<void>;
  readArtwork(artworkId: string): Promise<Artwork | null>;
  readArtworkAndGallery(artworkId: string): Promise<ArtworkAndGallery | null>;
  editArtwork({artwork}: {artwork: Artwork}): Promise<ArtworkNode | null>;
  editArtworkInquiry({edgeId, status}: {edgeId: string, status: string;}) : Promise<Edge | void>
  deleteArtwork({artworkId}: {artworkId: string}): Promise<boolean>;
  deleteUserArtworkRelationship({
    uid,
    action,
    artworkId,
  }: {
    uid: string;
    action: string;
    artworkId: string;
  }): Promise<void>;
  confirmGalleryArtworkEdge({
    artworkId,
    galleryId,
  }: {
    artworkId: string;
    galleryId: string;
  }): Promise<boolean>;
  listArtworksByGallery({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<(Artwork | null)[] | null>;

  listArtworkInquiresByGallery({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<(Artwork | null)[] | null> 

  listUserRelationshipArtworkByLimit({
    uid,
    limit,
    action,
  }: {
    uid: string;
    limit: number;
    action: string
  }): Promise<{[key: string] : Artwork}>

  swapArtworkOrder({
    artworkId,
    order,
  }: {
    artworkId: string;
    order: string;
  }): Promise<ArtworkNode | null>;

  generateArtworkId({artworkId}: {artworkId: string}): string;
  determinePriceBucket(price: string): string;
  determineSizeBucket(dimensions: Dimensions): string;
  determineYearBucket(yearString: string): string;
}
