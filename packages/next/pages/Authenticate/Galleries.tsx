import {Box} from '@mui/material';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
import React from 'react';

import {welcomeBack} from '../../browserFirebase/firebaseDB';
import {SignInForm, SignInWelcome} from '../../src/Components/Auth';
import {AuthEnum, WelcomeBack} from '../../src/Components/Auth/types';
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

export default function GallerySignIn({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <BaseHeader />
      <Box sx={styles.container}>
        <SignInWelcome
          welcomeBackData={data as WelcomeBack}
          signInType={userType}
        />
        <SignInForm signInType={userType} />
      </Box>
    </>
  );
}

type WelcomeBackData = {
  data: WelcomeBack;
};

export const getStaticProps: GetStaticProps<{
  data: WelcomeBackData;
}> = async () => {
  const welcomeBackData = (await welcomeBack(userType)) as WelcomeBackData;
  return {props: {data: welcomeBackData}};
};
