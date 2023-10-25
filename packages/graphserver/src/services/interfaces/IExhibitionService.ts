import {Artwork, Exhibition, ExhibitionObject, ExhibitionPreview, IBusinessLocationData, IGalleryProfileData,MapPinCities} from '@darta-types';

export interface IExhibitionService {
  createExhibition({
    userId,
    galleryId,
  }: {
    userId: string;
    galleryId: string;
  }): Promise<Exhibition | void>;
  createExhibitionToArtworkEdgeWithExhibitionOrder({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }): Promise<string>;
  batchEditArtworkToLocationEdgesByExhibitionId({
    locationId,
    uid,
    exhibitionId,
  }: {
    locationId: string;
    uid: string;
    exhibitionId: string;
  }): Promise<boolean>;
  batchEditArtworkToLocationEdges({
    locationData,
    artwork,
  }: {
    locationData: IBusinessLocationData;
    artwork: {[key: string]: Artwork};
  }): Promise<boolean>;
  editArtworkToLocationEdge({
    locationData,
    artworkId,
  }: {
    locationData: IBusinessLocationData;
    artworkId: string;
  }): Promise<boolean>;
  deleteExhibitionToArtworkEdge({
    exhibitionId,
    artworkId,
  }: {
    exhibitionId: string;
    artworkId: string;
  }): Promise<boolean>;

  readExhibitionForGallery({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void>;
  readGalleryExhibitionForUser({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<Exhibition | void>;
  readMostRecentGalleryExhibitionForUser(
    {locationId} : {locationId: string}
    ): Promise<{exhibition: Exhibition, gallery : IGalleryProfileData} | void> 
  editExhibition({
    exhibition,
    galleryId,
  }: {
    exhibition: Exhibition;
    galleryId: string;
  }): Promise<Exhibition | void>;
  listExhibitionForGallery({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<Exhibition[] | void>;

  listGalleryExhibitionsForUser({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<ExhibitionObject | void>;

  listGalleryExhibitionPreviewsForUser({
    galleryId,
  }: {
    galleryId: string;
  }): Promise<ExhibitionObject | null>;

  listActiveExhibitionsByCity({cityName} : {cityName: MapPinCities}): Promise<any>

  deleteExhibition({
    exhibitionId,
    galleryId,
    deleteArtworks,
  }: {
    exhibitionId: string;
    galleryId: string;
    deleteArtworks?: boolean;
  }): Promise<boolean>;
  reOrderExhibitionToArtworkEdgesAfterDelete({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<boolean>;
  verifyGalleryOwnsExhibition({
    exhibitionId,
    galleryId,
  }: {
    exhibitionId: string;
    galleryId: string;
  }): Promise<boolean>;
  reOrderExhibitionArtwork({
    exhibitionId,
    artworkId,
    desiredIndex,
    currentIndex,
  }: {
    exhibitionId: string;
    artworkId: string;
    desiredIndex: number;
    currentIndex: number;
  }): Promise<boolean>;
  listAllExhibitionArtworks({
    exhibitionId,
  }: {
    exhibitionId: string;
  }): Promise<any>;

  listExhibitionsPreviewsForUserByLimit({limit}: {limit: number}): Promise<{[key: string]: ExhibitionPreview} | void>
}
