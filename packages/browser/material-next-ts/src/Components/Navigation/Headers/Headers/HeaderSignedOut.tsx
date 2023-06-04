import * as React from 'react';
import {Box, Button} from '@mui/material';
import {useRouter} from 'next/router';
import Image from 'next/image';
import {headerStyles} from '../styles';
import {AuthEnum} from '../../../Auth/types';

export const HeaderSignedOut = ({authType}: {authType: AuthEnum}) => {
  const router = useRouter();
  return (
    <Box sx={headerStyles.headerBox} data-testid="header-navigation-box">
      <Button
        onClick={async () => {
          await router.push(`/Authenticate/${authType}`);
        }}
        sx={headerStyles.signOutButton}
        variant="contained"
        data-testid="header-navigation-signIn-button">
        Sign In
      </Button>
      <Button
        onClick={async () => {
          await router.push(`/CreateAccount/${authType}`);
        }}
        sx={headerStyles.signOutButton}
        variant="contained"
        data-testid="header-navigation-createAccount-button">
        Create Account
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
