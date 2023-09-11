import {GalleryState} from '@darta/types';

import {listArtworksByGalleryAPI} from './artworks/artworkRoutes';
import {listExhibitionsByGalleryAPI} from './exhibitions/exhibitionRotes';
import {readGalleryProfileAPI} from './galleries/galleryRoutes';

export const retrieveAllGalleryData = async (
  accessToken: string,
): Promise<GalleryState> => {
  const [galleryProfile, galleryArtworks, galleryExhibitions] =
    await Promise.all([
      readGalleryProfileAPI(),
      listArtworksByGalleryAPI(),
      listExhibitionsByGalleryAPI(),
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
