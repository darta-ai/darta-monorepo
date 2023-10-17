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
    UserGalleryAndArtwork = 'USER_GALLERY_AND_ARTWORK',
    UserPastTopTabNavigator = 'USER_PAST_TOP_TAB_NAVIGATOR',
    UserGallery = 'USER_GALLERY',
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

export enum RootStackEnum {
  feed = 'feed',
  explore = 'explore',
  me = 'me',
  darta = 'darta',
}

export enum ExhibitionRootEnum {
  exhibitionHome = 'EXHIBITION_HOME',
  exhibitionDetails = 'exhibition',
  artworkList = 'artwork',
  individualArtwork = 'individualArtwork',
  exhibitionGallery = 'gallery',
  TopTab = 'EXHIBITION_TOP_TAB',
  qrRouter = 'QR_ROUTER',
}

export type ExhibitionNavigatorParamList = {
  [ExhibitionRootEnum.exhibitionHome]: undefined;
  [ExhibitionRootEnum.exhibitionDetails]: {exhibition: Exhibition};
  [ExhibitionRootEnum.artworkList]: {artworkList : Exhibition["artworks"]};
  [ExhibitionRootEnum.exhibitionGallery]: {
    gallery: IGalleryProfileData | undefined
  };
  [ExhibitionRootEnum.TopTab]: {
    galleryId: string,
    exhibitionId: string,
    internalAppRoute: boolean,
    locationId?: string,
  };
  [ExhibitionRootEnum.qrRouter]: {
    galleryId: string,
  };
}


export enum PreviousExhibitionRootEnum {
  artworkList = 'previous_artwork',
  exhibitionDetails = 'previous_exhibition',
  navigatorScreen = 'PREVIOUS_EXHIBITION_NAVIGATOR',
}

export type PreviousExhibitionParamList = {
  [PreviousExhibitionRootEnum.artworkList]: {artworkList : Exhibition["artworks"]};
  [ExhibitionRootEnum.exhibitionDetails]: {
    exhibitionID: Exhibition | undefined
  };
}

export enum ExploreMapRootEnum {
  exploreMapHome = 'EXPLORE_MAP_HOME',
  exploreMapDetails = 'EXPLORE_MAP_DETAILS',
  TopTabExhibition = 'EXPLORE_MAP_TOP_TAB_EXHIBITION',
  exploreMapGallery = 'EXPLORE_MAP_GALLERY',
}

export type ExploreMapParamList = {
  [ExploreMapRootEnum.exploreMapHome]: undefined;
  [ExploreMapRootEnum.exploreMapDetails]: undefined;
  [ExploreMapRootEnum.TopTabExhibition]: {
    galleryId: string,
    exhibitionId: string,
  }
}

export enum RecommenderRoutesEnum {
  recommenderHome = 'RECOMMENDER_HOME',
  recommenderDetails = 'RECOMMENDER_DETAILS',
  TopTabExhibition = 'RECOMMENDER_TOP_TAB_EXHIBITION',
}