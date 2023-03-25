/* eslint-disable no-unused-vars */

export enum GalleryNavigatorEnum {
  galleryHome = 'GALLERY_HOME',
  gallery = 'DARTA',
  tombstone = 'TOMBSTONE',
}

export type GalleryRootStackParamList = {
  [GalleryNavigatorEnum.galleryHome]: null;
  [GalleryNavigatorEnum.gallery]: null;
  [GalleryNavigatorEnum.tombstone]: any;
};
