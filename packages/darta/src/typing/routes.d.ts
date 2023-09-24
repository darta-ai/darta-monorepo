import { Artwork } from "@darta/types";

export enum UserRoutesEnum {
    home = 'HOME',
    userGalleries = 'MY_GALLERIES',
    userArtists = 'MY_ARTISTS',
    savedWork = 'SAVED_WORK',
    learn = 'LEARN',
    userCollection = 'USER_COLLECTION',
    userSettings = 'USER_SETTINGS',
    userSavedArtwork = 'USER_SAVED_ARTWORK',
    userInquiredArtwork = 'USER_INQUIRED_ARTWORK',
    SavedArtworkModal = 'TOMBSTONE',
  }
  
  export enum GalleryNavigatorEnum {
    galleryHome = 'GALLERY_HOME',
    gallery = 'DARTA',
    tombstone = 'TOMBSTONE',
  }

  export type GalleryRootStackParamList = {
    [GalleryNavigatorEnum.galleryHome]: undefined;
    [GalleryNavigatorEnum.gallery]: undefined;
    [GalleryNavigatorEnum.tombstone]: {
      artOnDisplay: Artwork | undefined;
  };
}