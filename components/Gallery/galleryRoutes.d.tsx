/* eslint-disable no-unused-vars */

export enum GalleryNavigatorEnum {
  galleryHome = 'GALLERY_HOME',
  gallery = 'DARTA',
  tombstone = 'TOMBSTONE',
}

export type GalleryRootStackParamList = {
  [GalleryNavigatorEnum.galleryHome]: undefined;
  [GalleryNavigatorEnum.gallery]: undefined;
  [GalleryNavigatorEnum.tombstone]: undefined;
};
