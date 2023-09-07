import {GalleryState} from '../../globalTypes';
import { readGalleryProfile } from './galleries/galleryRoutes';
import { listArtworksByGallery } from './artworks/artworkRoutes'



export const retrieveAllGalleryData = async (accessToken: string): Promise<GalleryState> => {
  const galleryProfile = await readGalleryProfile()
  const galleryArtworks = await listArtworksByGallery()

  return {
    galleryProfile: galleryProfile,
    galleryArtworks: galleryArtworks,
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
