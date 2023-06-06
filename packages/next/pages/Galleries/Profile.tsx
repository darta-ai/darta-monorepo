import 'firebase/compat/auth';

import {Container} from '@mui/material';
import {GetStaticProps} from 'next';
import Head from 'next/head';
import React from 'react';

import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {EditProfileGallery, ProfileGallery} from '../../src/Components/Profile';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../styles';

const aboutStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '5%',
    width: '80vw',
    minHeight: '100vh',
    mb: 5,
    alignSelf: 'center',
    '@media (minWidth: 800px)': {
      paddingTop: '7vh',
    },
  },
  uploadImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '5%',
    alignItems: 'center',
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
  button: {
    color: PRIMARY_BLUE,
  },
  inputTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTextField: {
    width: '100%',
  },
};

// About component
export default function GalleryProfile() {
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);

  return (
    <>
      <Head>
        <title>Darta | Gallery</title>
        <meta
          name="description"
          content="Your profile page for your gallery on Darta."
        />
      </Head>

      <SideNavigationWrapper>
        <Container maxWidth="md" sx={aboutStyles.container}>
          {isEditingProfile ? (
            <EditProfileGallery
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
            />
          ) : (
            <ProfileGallery
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
            />
          )}
        </Container>
      </SideNavigationWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps<{
  data: any;
}> = async () => {
  return {props: {data: {data: {}}}};
  // try {
  //   // const aboutData = (await getGallery()) as null;
  // } catch (e) {
  //   return {props: {data: {data: {}}}};
  // }
};
