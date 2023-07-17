import {Box, Button} from '@mui/material';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React from 'react';

import {AuthEnum} from '../../../Auth/types';
import {headerStyles} from '../styles';

export function HeaderSignedOut({authType}: {authType: AuthEnum}) {
  const router = useRouter();
  return (
    <Box sx={headerStyles.headerBox} data-testid="header-navigation-box">
      <Button
        onClick={async () => {
          await router.push(`/Authenticate/${authType}`);
        }}
        sx={headerStyles.button}
        variant="contained"
        data-testid="header-navigation-signIn-button">
        Sign In
      </Button>
      <Button
        onClick={async () => {
          await router.push(`/CreateAccount/${authType}`);
        }}
        sx={headerStyles.button}
        variant="contained"
        data-testid="header-navigation-createAccount-button">
        Create Account
      </Button>
      <div />
      <div />
      <Box data-testid="header-navigation-image-box">
        <Image
          src="/static/images/dartahouseblue.png"
          data-testid="header-image"
          alt="me"
          width="80"
          height="64"
          onClick={() => router.push('/', undefined, {shallow: true})}
        />
      </Box>
    </Box>
  );
}
