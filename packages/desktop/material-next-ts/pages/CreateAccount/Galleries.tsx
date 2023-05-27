import React from 'react';
import {Box} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY, PRIMARY_MILK} from '../../styles';
import {AuthEnum, DartaBenefits} from '../../src/Components/Auth/types';
import {signUpBenefits} from '../../frontendFirebase/firebaseDB';
import {SignUpWelcome} from '../../src/Components/Auth/SignUpWelcome';
import type {GetStaticProps, InferGetStaticPropsType} from 'next';
import {SignUpForm} from '../../src/Components/Auth/SignUpForm';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '180vh',
    alignSelf: 'center',
    padding: '2vh',
    '@media (min-width:600px)': {
      padding: '10vh',
      flexDirection: 'row',
      height: '100vh',
    },

    boarderRadius: '30px',
  },
  introContainer: {
    flex: 4,
    height: '100%',
    backgroundColor: PRIMARY_BLUE,
    borderTopLeftRadius: '30px',
    borderTopRightRadius: '30px',
    '@media (min-width:600px)': {
      borderTopLeftRadius: '30px',
      borderBottomLeftRadius: '30px',
      borderTopRightRadius: '0px',
    },
  },
  textContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginLeft: '5%',
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    alignText: 'center',
    color: PRIMARY_MILK,
    fontSize: '1.5rem',
    '@media (min-width:600px)': {
      fontSize: '1.5rem',
    },
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (min-width:600px)': {
      fontSize: '1.2rem',
    },
  },
  formHelperText: {
    alignSelf: 'center',
    fontSize: 15,
  },
  checkBoxes: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    gap: '2%',
  },
  icon: {
    color: 'blue',
    transition: 'color 3s',
    'icon.white': {
      color: 'white',
    },
  },
};

export default function GallerySignIn({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Box sx={styles.container}>
        <SignUpWelcome benefitsData={data as DartaBenefits} />
        <SignUpForm signUpType={AuthEnum.galleries} />
      </Box>
    </>
  );
}


type BenefitsData = {
  data: DartaBenefits
};


export const getStaticProps: GetStaticProps<{
  data: BenefitsData;
}> = async () => {
  const benefitsData = await signUpBenefits(AuthEnum.galleries) as BenefitsData;
  return {props: {data: benefitsData}};
};
