import {Box} from '@mui/material';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
import React from 'react';

import {SignUpForm} from '../../src/Components/Auth/SignUpForm';
import {SignUpWelcome} from '../../src/Components/Auth/SignUpWelcome';
import {AuthEnum, DartaBenefits} from '../../src/Components/Auth/types';
import {signUpBenefits} from '../../ThirdPartyAPIs/firebaseDB';

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

export default function CuratorsSignIn({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Box sx={styles.container}>
      <SignUpWelcome benefitsData={data as DartaBenefits} />
      <SignUpForm signUpType={userType} />
    </Box>
  );
}

type BenefitsData = {
  data: DartaBenefits;
};

export const getStaticProps: GetStaticProps<{
  data: BenefitsData;
}> = async () => {
  try {
    const benefitsData = (await signUpBenefits(userType)) as BenefitsData;
    return {props: {data: benefitsData}};
  } catch (e) {
    console.log(e);
    return {props: {data: {data: {}}}};
  }
};
