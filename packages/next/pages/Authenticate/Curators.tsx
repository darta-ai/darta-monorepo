import {Box} from '@mui/material';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
import React from 'react';

import {SignInForm, SignInWelcome} from '../../src/Components/Auth';
import {AuthEnum, WelcomeBack} from '../../src/Components/Auth/types';
import {welcomeBack} from '../../ThirdPartyAPIs/firebaseDB';

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
const userType = AuthEnum.curators;

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
  try {
    const welcomeBackData = (await welcomeBack(userType)) as WelcomeBackData;
    return {props: {data: welcomeBackData}};
  } catch (e) {
    console.log(e);
    return {props: {data: {data: {}}}};
  }
};
