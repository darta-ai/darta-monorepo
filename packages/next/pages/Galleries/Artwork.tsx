import 'firebase/compat/auth';

import {Box, Container, Typography} from '@mui/material';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
import Head from 'next/head';
import React from 'react';

import {getAbout} from '../../browserFirebase/firebaseDB';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../styles';

const aboutStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5%',
    width: '100%',
    mb: 5,
    alignSelf: 'center',
    '@media (minWidth: 800px)': {
      paddingTop: '7vh',
    },
  },
  typographyTitle: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_BLUE,
    fontSize: '2rem',
    my: '3vh',
    '@media (min-width:800px)': {
      fontSize: '2.5rem',
    },
    cursor: 'default',
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_DARK_GREY,
    fontSize: '1rem',
    '@media (minWidth: 800px)': {
      fontSize: '1.3rem',
    },
    cursor: 'default',
  },
};

type AboutData = {
  HeadTitle: string;
  DartaCoreValue: string;
  Headline: string;
  WhoWeAre: string;
  DartaBelief1?: string;
  DartaBelief2?: string;
  DartaBelief3?: string;
  DartaBelief4?: string;
};

// About component
export default function GalleryArtworks({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{data.HeadTitle}</title>
        <meta
          name="description"
          content="Learn about Darta, your digital art advisor."
        />
      </Head>

      <SideNavigationWrapper>
        <Container maxWidth="md" sx={aboutStyles.container}>
          <Box>
            <Typography variant="h2" sx={aboutStyles.typographyTitle}>
              Artworks
            </Typography>
          </Box>
        </Container>
      </SideNavigationWrapper>
    </>
  );
}

type AboutDataFB = {
  data: AboutData;
};

export const getStaticProps: GetStaticProps<{
  data: any;
}> = async () => {
  try {
    const aboutData = (await getAbout()) as AboutDataFB;
    return {props: {data: aboutData}};
  } catch (e) {
    return {props: {data: {data: {}}}};
  }
};
