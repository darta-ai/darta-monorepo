import {ArtworkObject, IGalleryProfileData} from '@darta/types';
import {Box, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Head from 'next/head';
import React from 'react';

import {AuthContext} from '../../../pages/_app';
import {retrieveAllGalleryData} from '../../API/DartaGETrequests';
import {GalleryReducerActions, useAppState} from '../State/AppContext';

export function LoadProfile() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Learn about Darta, your digital art advisor."
        />
      </Head>
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Typography
          variant="h5"
          data-testid="loading-profile-text"
          sx={{textAlign: 'center'}}>
          Loading Profile
        </Typography>
        <LinearProgress color="secondary" />
      </Box>
      <Container maxWidth="lg" />
    </>
  );
}
