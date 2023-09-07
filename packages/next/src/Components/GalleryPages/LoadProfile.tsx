import {Box, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Head from 'next/head';
import React from 'react';

import {retrieveAllGalleryData} from '../../API/DartaGETrequests';
import {AuthContext} from '../../../pages/_app';
import {GalleryReducerActions, useAppState} from '../State/AppContext';
import { ArtworkObject, IGalleryProfileData } from '@darta/types';

export function LoadProfile() {
  const {dispatch} = useAppState();
  const {user} = React.useContext(AuthContext);

  React.useEffect(() => {
    const fetchData = async () => {
      if (user?.accessToken) {
        const {galleryProfile, galleryArtworks, galleryExhibitions} =
          await retrieveAllGalleryData(user.accessToken);
        
        dispatch({
          type: GalleryReducerActions.SET_ACCESS_TOKEN,
          payload: user?.accessToken,
        });
        dispatch({
          type: GalleryReducerActions.SET_PROFILE,
          payload: galleryProfile as IGalleryProfileData,
        });
        dispatch({
          type: GalleryReducerActions.SET_BATCH_ARTWORKS,
          payload: galleryArtworks as ArtworkObject,
        });
        dispatch({
          type: GalleryReducerActions.SET_EXHIBITIONS,
          payload: {...galleryExhibitions},
        });
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
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
