import React from 'react';
import {Box} from '@mui/material';
import {AuthEnum, WelcomeBack} from '../../src/Components/Auth/types';
import {SignInForm, SignInWelcome} from '../../src/Components/Auth';
import {welcomeBack} from '../../browserFirebase/firebaseDB';
import type {GetStaticProps, InferGetStaticPropsType} from 'next';

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

//defines everything
const userType = AuthEnum.artists;

export default function GallerySignIn({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Box sx={styles.container}>
      <SignInWelcome
        welcomeBackData={data as WelcomeBack}
        signInType={userType}
      />
      <SignInForm signInType={userType} />
    </Box>
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
