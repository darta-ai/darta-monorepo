import {Box, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import * as React from 'react';

import {retrieveAllGalleryData} from '../../API/DartaGETrequests';
import {GalleryHeader} from '../../src/Components/Navigation/Headers/GalleryHeader';
import {
  GalleryReducerActions,
  useAppState,
} from '../../src/Components/State/AppContext';
import {AuthContext} from '../_app';

const dartaHouseBlue = require('../../public/static/images/dartahouse.png');

export default function LoadProfile() {
  const router = useRouter();
  const {dispatch} = useAppState();
  const {user} = React.useContext(AuthContext);

  React.useEffect(() => {
    if (user?.accessToken) {
      const {galleryProfile, galleryArtworks, galleryExhibitions, accessToken} =
        retrieveAllGalleryData(user.accessToken);
      dispatch({
        type: GalleryReducerActions.SET_ACCESS_TOKEN,
        payload: accessToken,
      });
      dispatch({
        type: GalleryReducerActions.SET_PROFILE,
        payload: galleryProfile,
      });
      dispatch({
        type: GalleryReducerActions.SET_ARTWORKS,
        payload: {...galleryArtworks},
      });
      dispatch({
        type: GalleryReducerActions.SET_EXHIBITIONS,
        payload: {...galleryExhibitions},
      });
      const timer = setTimeout(() => {
        // redirect to the new page
        router.push('/Galleries/Profile');
      }, 2000);

      return () => clearTimeout(timer);
    }
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
      <GalleryHeader />
      <Box
        sx={{
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Box sx={{alignSelf: 'center'}}>
          <Image
            src={dartaHouseBlue}
            height={400}
            width={400}
            alt="darta house"
            data-testid="darta-house-logo"
          />
        </Box>
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
