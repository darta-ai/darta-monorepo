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
  tombstone = 'TOMBSTONE',
}

export type UserRouteStackParamList = {
  [UserRoutesEnum.home]: undefined;
  [UserRoutesEnum.userGalleries]: undefined;
  [UserRoutesEnum.userArtists]: undefined;
  [UserRoutesEnum.savedWork]: undefined;
  [UserRoutesEnum.learn]: undefined;
  [UserRoutesEnum.userSettings]: undefined;
  [UserRoutesEnum.userSavedArtwork]: undefined;
  [UserRoutesEnum.userInquiredArtwork]: undefined;
  [UserRoutesEnum.tombstone]: undefined;
};
