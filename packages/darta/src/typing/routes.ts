import { Artwork, Exhibition, IGalleryProfileData } from "@darta-types";

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
  
  // TO-DO
export type UserRouteStackParamList = {
  [UserRoutesEnum.home]: undefined;
  [UserRoutesEnum.userGalleries]: undefined;
  [UserRoutesEnum.userArtists]: undefined;
  [UserRoutesEnum.savedWork]: undefined;
  [UserRoutesEnum.learn]: undefined;
  [UserRoutesEnum.userSettings]: undefined;
  [UserRoutesEnum.userSavedArtwork]: undefined;
  [UserRoutesEnum.userInquiredArtwork]: undefined;
  [UserRoutesEnum.SavedArtworkModal]: undefined;
};

  export enum GalleryNavigatorEnum {
    galleryHome = 'GALLERY_HOME',
    gallery = 'DARTA',
    tombstone = 'TOMBSTONE',
  }

   // TO-DO
  export type GalleryRootStackParamList = {
    [GalleryNavigatorEnum.galleryHome]: undefined;
    [GalleryNavigatorEnum.gallery]: undefined;
    [GalleryNavigatorEnum.tombstone]: {
      artOnDisplay: Artwork | undefined;
  };
}


export enum ExhibitionRootEnum {
  exhibitionHome = 'EXHIBITION_HOME',
  exhibitionDetails = 'EXHIBITION_DETAILS',
  artworkList = 'ARTWORK_LIST',
  artwork = 'ARTWORK',
  galleryProfile = 'GALLERY_PROFILE',
}

 // TO-DO
export type ExhibitionNavigatorParamList = {
  [ExhibitionRootEnum.exhibitionHome]: undefined;
  [ExhibitionRootEnum.exhibitionDetails]: {exhibition: Exhibition};
  [ExhibitionRootEnum.artworkList]: {artworkList : Exhibition["artworks"]};
  [ExhibitionRootEnum.artwork]: {
    artwork: Artwork | undefined;
  };
  [ExhibitionRootEnum.galleryProfile]: {
    gallery: IGalleryProfileData | undefined
  };
  
}