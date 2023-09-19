import {Box} from '@mui/material';
import React from 'react';

import {benefitsData} from '../../data/pamphletPages';
import {SignUpForm} from '../../src/Components/Auth/Forms/SignUpForm';
import {AuthEnum, DartaBenefits} from '../../src/Components/Auth/types';
import {SignUpWelcome} from '../../src/Components/Auth/Welcome/SignUpWelcome';
import {BaseHeader} from '../../src/Components/Navigation/Headers/BaseHeader';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '180vh',
    alignSelf: 'center',
    padding: '2vh',
    '@media (min-width:800px)': {
      padding: '10vh',
      flexDirection: 'row',
      height: '100vh',
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
        <SignUpWelcome benefitsData={benefitsData as DartaBenefits} />
        <SignUpForm signUpType={userType} />
      </Box>
    </>
  );
}
