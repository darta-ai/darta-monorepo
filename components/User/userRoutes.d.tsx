export enum UserRoutesEnum {
  home = 'HOME',
  userGalleries = 'MY_GALLERIES',
  userArtists = 'MY_ARTISTS',
  savedWork = 'SAVED_WORK',
  learn = 'LEARN',
  userCollection = 'USER_COLLECTION',
  userSettings = 'USER_SETTINGS',
}

export type UserRouteStackParamList = {
  [UserRoutesEnum.home]: null;
  [UserRoutesEnum.userGalleries]: null;
  [UserRoutesEnum.userArtists]: null;
  [UserRoutesEnum.savedWork]: any;
  [UserRoutesEnum.learn]: any;
  [UserRoutesEnum.userSettings]: any;
};
