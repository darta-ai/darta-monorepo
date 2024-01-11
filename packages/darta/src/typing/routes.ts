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
    UserListsScreen = 'USER_LISTS_SCREEN',
    UserGalleryAndArtwork = 'USER_GALLERY_AND_ARTWORK',
    UserPastTopTabNavigator = 'USER_PAST_TOP_TAB_NAVIGATOR',
    UserGallery = 'USER_GALLERY',
    userListFull = 'USER_LIST_FULL',
    individualArtwork= 'USER_INDIVIDUAL_ARTWORK',
    userAddToList = 'USER_ADD_TO_LIST',
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
    [GalleryNavigatorEnum.gallery]: {
      navigation: any,
      artOnDisplay: Artwork | undefined;
    };
    [GalleryNavigatorEnum.tombstone]: {
      artOnDisplay: Artwork | undefined;
  };
}

export enum RootStackEnum {
  feed = 'feed',
  view = 'view',
  me = 'me',
  darta = 'darta',
}

export enum ExhibitionRootEnum {
  exhibitionHome = 'EXHIBITION_HOME',
  exhibitionDetails = 'EXHIBITION_HOME_exhibition',
  artworkList = 'EXHIBITION_HOME_artwork_list',
  individualArtwork = 'EXHIBITION_HOME_individualArtwork',
  exhibitionGallery = 'EXHIBITION_HOME_gallery',
  showGallery = 'EXHIBITION_HOME_showGallery',
  TopTab = 'EXHIBITION_TOP_TAB',
  qrRouter = 'QR_ROUTER',
  genericLoading= 'GENERIC_LOADING',
  exhibitionListAdd = 'EXHIBITION_LIST_ADD',
}


export enum ExhibitionPreviewEnum {
  onView = 'EXHIBITION_PREVIEW_ON_VIEW',
  forthcoming = 'EXHIBITION_PREVIEW_FORTHCOMING',
  following = 'EXHIBITION_PREVIEW_FOLLOWING',
}

export enum ListEnum {
  fullList = 'FULL_LIST',
  fullMap = 'FULL_MAP',
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
  [ExhibitionRootEnum.showGallery]: {
    galleryId?: string,
  }
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
  explorePastNavigator = 'EXPLORE_PAST_NAVIGATOR', 
  individualArtwork = 'INDIVIDUAL_ARTWORK',
  exploreMapListAdd = 'EXPLORE_MAP_LIST_ADD',
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
  recommenderGallery = 'RECOMMENDER_GALLERY',
  recommenderExhibition= 'RECOMMENDER_EXHIBITION',
  TopTabExhibition = 'RECOMMENDER_TOP_TAB_EXHIBITION',
  TopTabPreviousExhibition = 'RECOMMENDER_TOP_TAB_PREVIOUS_EXHIBITION',
  recommenderLists = 'RECOMMENDER_LISTS',
  recommenderNewList = 'RECOMMENDER_NEW_LIST',
  recommenderFullList = 'RECOMMENDER_FULL_LIST',
  recommenderGenericLoading = 'RECOMMENDER_GENERIC_LOADING',
  recommenderArtworkList = 'RECOMMENDER_ARTWORK_LIST',
  recommenderIndividualArtwork = 'RECOMMENDER_INDIVIDUAL_ARTWORK',
}

export type RecommenderParamList = {
  [RecommenderRoutesEnum.recommenderHome]: undefined;
  [RecommenderRoutesEnum.recommenderDetails]: undefined;
  [RecommenderRoutesEnum.TopTabExhibition]: {
    galleryId: string,
    exhibitionId: string,
  }
}