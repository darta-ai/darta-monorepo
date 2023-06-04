import * as React from 'react';
import {Box, Button} from '@mui/material';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {firebaseSignOut} from '../../../../../browserFirebase/firebaseApp';
import {headerStyles} from '../styles';
import {AuthEnum} from '../../../Auth/types';

export const HeaderSignedIn = ({authType}: {authType: AuthEnum}) => {
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
    <Box sx={headerStyles.headerBox} data-testid="header-navigation-box">
      <Button
        onClick={async () => {
          await handleSignOut();
        }}
        sx={headerStyles.signOutButton}
        variant="contained"
        data-testid="header-navigation-signout-button">
        Sign Out
      </Button>
      <Button
        onClick={async () => {
          router.push(`/${authType}/Profile`);
        }}
        sx={headerStyles.signOutButton}
        variant="contained"
        data-testid="header-navigation-signout-button">
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
          alt="me"
          width="64"
          height="64"
          onClick={() => router.push('/', undefined, {shallow: true})}
        />
      </Box>
    </Box>
  );
};
