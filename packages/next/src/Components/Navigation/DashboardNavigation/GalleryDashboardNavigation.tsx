import * as Colors from '@darta-styles'
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {styled} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';

import {EGalleryDisplay} from '../../../../pages/Galleries/Profile';
import {AuthEnum} from '../../Auth/types';
import {HeaderSignedIn} from '../Headers/Headers/HeaderSignedIn';
import { SignedInNavigator } from '../Headers/Headers/SignedInNavigator';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: Colors.PRIMARY_900,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


export function MiniDrawer({
  setCurrentDisplay,
}: {
  setCurrentDisplay: (arg0: EGalleryDisplay) => void;
}) {


  return (
    <Box sx={{display: 'flex'}} data-testid="mainBox">
      <CssBaseline />
      <AppBar position="fixed" data-testid="appBar">
        <Toolbar>
          <HeaderSignedIn authType={AuthEnum.galleries} />
        </Toolbar>
          <SignedInNavigator setCurrentDisplay={setCurrentDisplay} />
      </AppBar>
    </Box>
  );
}
