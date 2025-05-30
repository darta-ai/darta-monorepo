import {GalleryState} from '@darta-types';

import {listArtworksByGalleryAPI} from './artworks/artworkRoutes';
import {listExhibitionsByGalleryAPI} from './exhibitions/exhibitionRotes';
import {readGalleryProfileAPI} from './galleries/galleryRoutes';

export const retrieveAllGalleryData = async (): Promise<GalleryState> => {
  try{
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
      accessToken: '',
      user: {},
    };
  } catch (e) {
    return {
      galleryProfile: {} as any,
      galleryArtworks: {},
      galleryExhibitions: {},
      accessToken: '',
      user: {},
    };
  };
}

export const retrieveGalleryArtworks = (
  accessToken: string,
): Partial<GalleryState> => 
  // NEED ENDPOINTS HERE

   ({
    galleryArtworks: {
      // ...preloadArtwork
    },
    accessToken,
  })
;

export const retrieveGalleryExhibitions = (
  accessToken: string,
): Partial<GalleryState> => 
  // NEED ENDPOINTS HERE

   ({
    galleryExhibitions: {
      // '02003454-b638-44a6-bb38-d418d8390729': dummyExhibition,
    },
    accessToken,
  })
;
