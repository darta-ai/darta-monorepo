import React from 'react';
import Head from 'next/head';
import 'firebase/compat/auth';
import {Container, Typography, Box, TextField, Button} from '@mui/material';
import {GetStaticProps, InferGetStaticPropsType} from 'next';
import {getGallery} from '../../browserFirebase/firebaseDB';
import {PRIMARY_BLUE, PRIMARY_DARK_GREY} from '../../styles';
import {SideNavigationWrapper} from '../../src/Components/Navigation/DashboardNavigation/GalleryDashboardNavigation';
import {useForm} from 'react-hook-form';
import {
  EditProfileGallery,
  ProfileGallery,
} from '../../src/Components/Profile/';
import {ImageUploadModal} from '../../src/Components/Modals/UploadImageModal';
import Image from 'next/image';

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
export default function GalleryProfile({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [editingProfile, setEditing] = React.useState(false);

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
          {editingProfile ? <EditProfileGallery /> : <ProfileGallery />}
        </Container>
      </SideNavigationWrapper>
    </>
  );
}

type AboutDataFB = {
  data: AboutData | null;
};

export const getStaticProps: GetStaticProps<{
  data: any;
}> = async () => {
  try {
    const aboutData = (await getGallery()) as null;
    return {props: {data: {data: {}}}};
  } catch (e) {
    return {props: {data: {data: {}}}};
  }
};
