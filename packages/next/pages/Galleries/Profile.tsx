import 'firebase/compat/auth';

import {Box} from '@mui/material';
import React from 'react';

import authRequired from '../../src/common/AuthRequired/AuthRequired';
import {
  GalleryArtwork,
  GalleryExhibition,
  GalleryProfile,
  LoadProfile,
} from '../../src/Components/GalleryPages';
import {MiniDrawer} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';

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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      // redirect to the new page
      setCurrentDisplay(EGalleryDisplay.Profile);
    }, 750);

    return () => clearTimeout(timer);
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
