import {Artwork, Dimensions, PreviewArtwork} from '@darta-types';
import { Edge } from 'arangojs/documents';

import {ArtworkNode} from '../../models/models';

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
  readArtworkForList(artworkId: string): Promise<Artwork | null>;
  readArtworkPreview({artworkId}: {artworkId: string}): Promise<PreviewArtwork | null>
  readArtworkEmailAndGallery({artworkId}: {artworkId: string}): Promise<{galleryName: string | null, galleryEmail: string | null} | null>
  readAllArtworks(): Promise<Artwork[] | null>;
  editArtwork({artwork}: {artwork: Artwork}): Promise<ArtworkNode | null>;
  editArtworkInquiry({edgeId, status}: {edgeId: string, status: string;}) : Promise<Edge | void>
  checkForDuplicatesWithImageNameAndArtist({
    artistName,
    artworkTitle,
    galleryId,
  }: {
    artistName: string;
    artworkTitle: string;
    galleryId: string;
  }): Promise<boolean>;
  refreshArtworkImage({
    artworkId,
    mainUrl,
    mediumUrl,
    smallUrl
  }: {
    artworkId: string;
    mainUrl: string;
    mediumUrl: string | null;
    smallUrl: string | null;
  }): Promise<void>
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
