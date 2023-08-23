import {GalleryState} from '../../globalTypes';
import {
  artwork1,
  artwork2,
  artwork3,
  dummyExhibition,
  soteGalleryProfile,
} from '../dummyData';

const preloadArtwork = {
  // ...artwork1,
  // ...artwork2,
  // ...artwork3,
};

export const retrieveAllGalleryData = (accessToken: string): GalleryState => {
  // NEED ENDPOINTS HERE

  return {
    galleryProfile: {
      // ...soteGalleryProfile
    },
    galleryArtworks: {
      // ...preloadArtwork
    },
    galleryExhibitions: {
      // '02003454-b638-44a6-bb38-d418d8390729': dummyExhibition,
    },
    accessToken,
  };
};

export const retrieveGalleryArtworks = (
  accessToken: string,
): Partial<GalleryState> => {
  // NEED ENDPOINTS HERE

  return {
    galleryArtworks: {
      // ...preloadArtwork
    },
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
    galleryExhibitions: {
      // '02003454-b638-44a6-bb38-d418d8390729': dummyExhibition,
    },
    accessToken,
  };
};
