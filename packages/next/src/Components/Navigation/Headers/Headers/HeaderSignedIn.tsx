import {Box, Button} from '@mui/material';
import Image from 'next/image';
import {useRouter} from 'next/router';
import * as React from 'react';

import {firebaseSignOut} from '../../../../../ThirdPartyAPIs/firebaseApp';
import {AuthEnum} from '../../../Auth/types';
import {headerStyles} from '../styles';

export function HeaderSignedIn({authType}: {authType: AuthEnum}) {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      router.push('/');
    } catch (err) {
      // console.log(err);
    }
  };
  return (
    <Box sx={headerStyles.headerBox} data-testid="header-navigation-box">
      <Button
        onClick={async () => {
          await handleSignOut();
        }}
        sx={headerStyles.button}
        variant="contained"
        data-testid="header-navigation-signout-button">
        Sign Out
      </Button>
      <Button
        onClick={async () => {
          router.push(`/${authType}/Profile`);
        }}
        sx={headerStyles.button}
        variant="contained"
        data-testid="header-navigation-dashboard-button">
        Dashboard
      </Button>
      <div />
      <div />
      <div />
      <div />
      <Box data-testid="header-navigation-image-box">
        <Image
          src="/static/images/dartahouseblue.png"
          data-testid="header-image"
          alt="home"
          width="80"
          height="64"
          onClick={() => router.push('/', undefined, {shallow: true})}
        />
      </Box>
    </Box>
  );
}
