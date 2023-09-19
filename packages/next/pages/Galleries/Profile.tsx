import 'firebase/compat/auth';

import {ArtworkObject, IGalleryProfileData} from '@darta/types';
import {Box} from '@mui/material';
import React from 'react';

import {retrieveAllGalleryData} from '../../src/API/DartaGETrequests';
import authRequired from '../../src/common/AuthRequired/AuthRequired';
import {
  GalleryArtwork,
  GalleryExhibition,
  GalleryProfile,
  LoadProfile,
} from '../../src/Components/GalleryPages';
import {MiniDrawer} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {
  GalleryReducerActions,
  useAppState,
} from '../../src/Components/State/AppContext';
import {AuthContext} from '../_app';

export enum EGalleryDisplay {
  Profile = 'PROFILE',
  Exhibitions = 'EXHIBITIONS',
  Artwork = 'ARTWORK',
  Load = 'LOAD',
}

const profileStyles = {
  display: 'flex',
  flexDirection: 'row',
  alignContent: 'center',
  width: '100%',
  height: '100%',
  mt: 10,
};

// About component
function Gallery() {
  const [currentDisplay, setCurrentDisplay] = React.useState<EGalleryDisplay>(
    EGalleryDisplay.Load,
  );
  const {dispatch} = useAppState();
  const {user} = React.useContext(AuthContext);

  React.useEffect(() => {
    const fetchData = async () => {
      if (user?.accessToken) {
        const {galleryProfile, galleryArtworks, galleryExhibitions} =
          await retrieveAllGalleryData();
        dispatch({
          type: GalleryReducerActions.SET_PROFILE,
          payload: galleryProfile as IGalleryProfileData,
        });
        dispatch({
          type: GalleryReducerActions.SET_BATCH_ARTWORK,
          payload: galleryArtworks as ArtworkObject,
        });
        dispatch({
          type: GalleryReducerActions.SET_EXHIBITIONS,
          payload: galleryExhibitions,
        });
        setCurrentDisplay(EGalleryDisplay.Profile);
      } else {
        // TO-DO: error handling
      }
    };
    fetchData();
  }, []);
  return (
    <Box sx={profileStyles}>
      <MiniDrawer setCurrentDisplay={setCurrentDisplay} />
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        {currentDisplay === EGalleryDisplay.Load && <LoadProfile />}
        {currentDisplay === EGalleryDisplay.Profile && <GalleryProfile />}
        {currentDisplay === EGalleryDisplay.Exhibitions && (
          <GalleryExhibition />
        )}
        {currentDisplay === EGalleryDisplay.Artwork && <GalleryArtwork />}
      </Box>
    </Box>
  );
}

export default authRequired(Gallery);
