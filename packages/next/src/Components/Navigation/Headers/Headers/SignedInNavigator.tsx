import * as Colors from '@darta-styles'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import ImageIcon from '@mui/icons-material/Image';
import {Box, Button, Typography} from '@mui/material';
import React from 'react';

import {EGalleryDisplay} from '../../../../../pages/Galleries/Profile';
import { formStyles } from '../../../FormComponents/styles';
import {headerStyles} from '../styles';


export function SignedInNavigator({
  setCurrentDisplay,
}: {
  setCurrentDisplay: (arg0: EGalleryDisplay) => void;
}) {

  const sideNavigationStyles = {
    listItemButton: {
      minHeight: 48,
      justifyContent: 'center',
      width: '100%',
      color: Colors.PRIMARY_900,
      borderColor: Colors.PRIMARY_900,
    },
  };

  return (
    <Box sx={headerStyles.headerNavigation} data-testid="header-navigation-box">
      <Box sx={{width: '100%', borderLeft: '1px solid black'}}>
        <Button 
         data-testid="gallery-navigation-profile-button"
         className="gallery-navigation-profile"
         sx={sideNavigationStyles.listItemButton}
         onClick={() => setCurrentDisplay(EGalleryDisplay.Profile)}
         startIcon={<AccountCircleIcon />}
        >
          <Typography sx={formStyles.hiddenOnMobile}>Profile</Typography>
        </Button>
      </Box>
      <Box sx={{width: '100%', borderLeft: '1px solid black'}}>
        <Button 
         data-testid="gallery-navigation-profile-button"
         className="gallery-navigation-profile"
        //  variant="outlined"
         sx={sideNavigationStyles.listItemButton}
         onClick={() => setCurrentDisplay(EGalleryDisplay.Exhibitions)}
         startIcon={<EventIcon />}
        >
          <Typography sx={formStyles.hiddenOnMobile}>Exhibitions</Typography>
        </Button>
      </Box>
      <Box sx={{width: '100%', borderLeft: '1px solid black'}}>
        <Button 
         data-testid="gallery-navigation-profile-button"
         className="gallery-navigation-profile"
         sx={sideNavigationStyles.listItemButton}
         onClick={() => setCurrentDisplay(EGalleryDisplay.Artwork)}
         startIcon={<ImageIcon />}
        >
          <Typography sx={formStyles.hiddenOnMobile}>Artwork</Typography>
        </Button>
      </Box>
    </Box>

  );
}
