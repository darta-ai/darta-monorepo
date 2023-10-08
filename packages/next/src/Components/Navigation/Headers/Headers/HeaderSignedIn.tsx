import * as Colors from '@darta-styles';
import {Box, Button, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import React from 'react';

import {firebaseSignOut} from '../../../../ThirdPartyAPIs/firebaseApp';
import {AuthEnum} from '../../../Auth/types';
import {useAppState} from '../../../State/AppContext';
import {headerStyles} from '../styles';

export function HeaderSignedIn({authType}: {authType: AuthEnum}) {
  const router = useRouter();
  const {state} = useAppState();
  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push('/');
    } catch (err) {
      // console.log(err);
    }
  };

  const image = state?.galleryProfile?.galleryLogo?.value ?? '';
  return (
    <Box sx={headerStyles.headerBox} data-testid="header-navigation-box">
      <Button
        onClick={async () => {
          await handleSignOut();
        }}
        sx={headerStyles.button}
        variant="contained"
        data-testid="header-navigation-signOut-button">
        Sign Out
      </Button>
      {/* <Button
        onClick={async () => {
          
        }}
        sx={headerStyles.button}
        variant="contained"
        data-testid="header-navigation-dashboard-button">
        Dashboard
      </Button> */}
      <div />
      <div />
      <Box
        sx={headerStyles.imageBoxContainer}
        onClick={() => router.push(`/${authType}/Profile`)}>
        {image ? (
          <>
            <Box
              component="img"
              src={image}
              sx={headerStyles.imageBox}
              data-testid="header-image"
            />
            <Box sx={{alignSelf: 'center'}}>
              <Typography variant="h5" style={{color: Colors.PRIMARY_50}}>+</Typography>
            </Box>
          </>
        ) : (
          <>
            <Box sx={headerStyles.imageBox} />
            <Box sx={{alignSelf: 'center'}}>
              <Typography variant="h4" />
            </Box>
          </>
        )}
        <Box
          component="img"
          sx={headerStyles.dartaImageBox}
          src="/static/images/dartahousewhite.png"
          data-testid="header-image"
          alt="logo"
        />
      </Box>
    </Box>
  );
}
