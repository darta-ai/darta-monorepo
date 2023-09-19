import {Box} from '@mui/material';
import React from 'react';

import {welcomeBackData} from '../../data/pamphletPages';
import {SignInForm, SignInWelcome} from '../../src/Components/Auth';
import {AuthEnum, WelcomeBack} from '../../src/Components/Auth/types';
import {BaseHeader} from '../../src/Components/Navigation/Headers/BaseHeader';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    alignSelf: 'center',
    padding: '2vh',
    '@media (min-width:800px)': {
      padding: '10vh',
      flexDirection: 'row',
    },

    boarderRadius: '30px',
  },
};

// defines everything
const userType = AuthEnum.galleries;

export default function GallerySignIn() {
  return (
    <>
      <BaseHeader />
      <Box sx={styles.container}>
        <SignInWelcome
          welcomeBackData={welcomeBackData as WelcomeBack}
          signInType={userType}
        />
        <SignInForm signInType={userType} />
      </Box>
    </>
  );
}
