import {GalleryState} from '@darta/types';
import { readGalleryProfile } from './galleries/galleryRoutes';
import { listArtworksByGallery } from './artworks/artworkRoutes'
import { listExhibitionsByGallery } from './exhibitions/exhibitionRotes'



export const retrieveAllGalleryData = async (accessToken: string): Promise<GalleryState> => {
  const [galleryProfile, galleryArtworks, galleryExhibitions] = await Promise.all([
    readGalleryProfile(),
    listArtworksByGallery(),
    listExhibitionsByGallery()
  ]);

  return {
    galleryProfile,
    galleryArtworks,
    galleryExhibitions,
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
