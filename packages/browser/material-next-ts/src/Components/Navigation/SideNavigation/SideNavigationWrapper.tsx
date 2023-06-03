import * as React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import {styled, useTheme, Theme, CSSObject} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {PRIMARY_BLUE} from '../../../../styles';
import {useRouter} from 'next/router';
import {AuthContext} from '../../../../pages/_app';
import {firebaseSignOut} from '../../../../browserFirebase/firebaseApp';
import Image from 'next/image';
import {Button} from '@mui/material';
import {PRIMARY_MILK, PRIMARY_LIGHTBLUE} from '../../../../styles';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 240;

const styles = {
  headerBox: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '1%',
    backgroundColor: PRIMARY_BLUE,
  },
  signOutButton: {
    backgroundColor: PRIMARY_MILK,
    color: PRIMARY_BLUE,
    fontSize: '0.8rem',
    '@media (min-width:750px)': {
      fontSize: '1rem',
    },
  },
};

const HeaderSignedIn = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box sx={styles.headerBox} data-testid="header-navigation-box">
      <Button
        onClick={async () => {
          await handleSignOut();
        }}
        sx={styles.signOutButton}
        variant="contained"
        data-testid="header-navigation-signout-button">
        Sign Out
      </Button>
      <div />
      <div />
      <div />
      <div />
      <Box data-testid="header-navigation-image-box">
        <Image
          src="/static/images/dartahouseblue.png"
          data-testid="header-image"
          alt="me"
          width="64"
          height="64"
          onClick={() => router.push('/', undefined, {shallow: true})}
        />
      </Box>
    </Box>
  );
};

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  paddingTop: '40px',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingTop: '40px',
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: PRIMARY_BLUE,
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

const Drawer = styled(MuiDrawer, {shouldForwardProp: prop => prop !== 'open'})(
  ({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const {user} = React.useContext(AuthContext);

  const navTo = user?.displayName;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const sideNavigationStyles = {
    listItemButton: {
      minHeight: 48,
      justifyContent: open ? 'initial' : 'center',
      px: 2.5,
    },
    listItemIcon: {
      minWidth: 0,
      mr: open ? 3 : 'auto',
      justifyContent: 'center',
    },
  };

  return (
    <Box sx={{display: 'flex'}} data-testid="mainBox">
      <CssBaseline />
      <AppBar position="fixed" open={open} data-testid="appBar">
        <Toolbar>
          <IconButton
            data-testid="menuButton"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              color: PRIMARY_MILK,
              ...(open && {display: 'none'}),
            }}>
            <MenuIcon />
          </IconButton>
          <HeaderSignedIn />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} data-testid="drawer">
        <DrawerHeader data-testid="drawerHeader">
          <IconButton sx={{opacity: open ? 1 : 0}} onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Divider />
        <List data-testid="mainList">
        <ListItem key={'Home'} disablePadding>
            <ListItemButton
              data-testid="homeButton"
              onClick={() => {
                router.push(`/${navTo}/Home`);
              }}
              sx={sideNavigationStyles.listItemButton}>
              <ListItemIcon sx={sideNavigationStyles.listItemIcon}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                sx={{opacity: open ? 1 : 0, fontFamily: 'EB Garamond'}}
                primary={'Home'}
              />
            </ListItemButton>
          </ListItem>
          <ListItem key={'Profile'} disablePadding>
            <ListItemButton
              data-testid="profileButton"
              sx={sideNavigationStyles.listItemButton}
              onClick={() => {
                router.push(`/${navTo}/Profile`);
              }}>
              <ListItemIcon sx={sideNavigationStyles.listItemIcon}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText
                sx={{opacity: open ? 1 : 0, fontFamily: 'EB Garamond'}}
                primary={'Profile'}
              />
            </ListItemButton>
          </ListItem>
          <ListItem key={'Collections'} disablePadding>
            <ListItemButton
              data-testid="collectionsButton"
              sx={sideNavigationStyles.listItemButton}
              onClick={() => {
                router.push(`/${navTo}/Collections`);
              }}>
              <ListItemIcon sx={sideNavigationStyles.listItemIcon}>
                <WorkspacesIcon />
              </ListItemIcon>
              <ListItemText
                sx={{opacity: open ? 1 : 0, fontFamily: 'EB Garamond'}}
                primary={'Collections'}
              />
            </ListItemButton>
          </ListItem>
          <ListItem key={'Artwork'} disablePadding>
            <ListItemButton
              data-testid="artworkButton"
              sx={sideNavigationStyles.listItemButton}
              onClick={() => {
                router.push(`/${navTo}/Artwork`);
              }}>
              <ListItemIcon sx={sideNavigationStyles.listItemIcon}>
                <ArtTrackIcon />
              </ListItemIcon>
              <ListItemText
                sx={{opacity: open ? 1 : 0, fontFamily: 'EB Garamond'}}
                primary={'Artwork'}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );

}

// here is a wrapper component that will be used to wrap the pages that need to be protected by MiniDrawer
export const SideNavigationWrapper = ({children}: {children: any}) => {
  return (
    <Box sx={{display: 'flex'}}>
      <MiniDrawer />
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};
