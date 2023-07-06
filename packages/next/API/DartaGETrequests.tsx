import {GalleryState} from '../globalTypes';
import {artwork1, artwork2, artwork3} from '../src/dummyData';

export const retrieveAllGalleryData = (accessToken: string): GalleryState => {
  // NEED ENDPOINTS HERE

  return {
    galleryProfile: {},
    galleryArtworks: {...artwork1, ...artwork2, ...artwork3},
    galleryExhibitions: {},
    accessToken,
  };
};

export const retrieveGalleryArtworks = (
  accessToken: string,
): Partial<GalleryState> => {
  // NEED ENDPOINTS HERE

  return {
    galleryArtworks: {...artwork1, ...artwork2, ...artwork3},
    accessToken,
  };
};

export const retrieveGalleryProfile = (
  accessToken: string,
): Partial<GalleryState> => {
  // NEED ENDPOINTS HERE

  return {
    galleryProfile: {},
    accessToken,
  };
};

export const retrieveGalleryExhibitions = (
  accessToken: string,
): Partial<GalleryState> => {
  // NEED ENDPOINTS HERE

  return {
    galleryExhibitions: {},
    accessToken,
  };
};
