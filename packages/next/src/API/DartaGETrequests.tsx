import {GalleryState} from '../../globalTypes';
import { getGalleryProfile } from './galleries/galleries';
import {getGalleryArtworks} from './artworks/artwork'

const preloadArtwork = {
  // ...artwork1,
  // ...artwork2,
  // ...artwork3,
};

export const retrieveAllGalleryData = async (accessToken: string): Promise<GalleryState> => {
  const galleryProfile = await getGalleryProfile()
  const galleryArtworks = await getGalleryArtworks()

  return {
    galleryProfile: galleryProfile.data,
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
