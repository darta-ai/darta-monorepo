import {Box, Button, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import * as React from 'react';

import {firebaseSignOut} from '../../../../../ThirdPartyAPIs/firebaseApp';
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
        {image && (
          <>
            <Box
              component="img"
              src={image}
              sx={headerStyles.imageBox}
              data-testid="header-image"
            />
            <Box>
              <Typography variant="h4">+</Typography>
            </Box>
          </>
        )}
        <Box
          component="img"
          sx={headerStyles.dartaImageBox}
          src="/static/images/dartahouseblue.png"
          data-testid="header-image"
          alt="logo"
        />
      </Box>
    </Box>
  );
}
