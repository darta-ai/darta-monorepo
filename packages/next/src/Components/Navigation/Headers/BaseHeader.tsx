import {Box, Button} from '@mui/material';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React from 'react';

import {AuthContext} from '../../../../pages/_app';
import {AuthEnum} from '../../Auth/types';
import {headerStyles} from './styles';

export function BaseHeader() {
  const router = useRouter();
  const {user} = React.useContext(AuthContext);

  const userIsAuthenticated = user !== null;
  const userIsArtist = user?.displayName === AuthEnum.artists;

  const galleryRoute = `/Galleries/Home`;
  const artistRoute = `/Artists/Home`;

  const showArtistLink =
    (userIsArtist && userIsAuthenticated) || !userIsAuthenticated;
  const showGaleryLink =
    (!userIsArtist && userIsAuthenticated) || !userIsAuthenticated;

  return (
    <Box sx={headerStyles.headerBox} data-testid="header-box">
      {showArtistLink && (
        <Button
          onClick={async () => {
            await router.push(artistRoute);
          }}
          sx={headerStyles.button}
          variant="contained"
          data-testid="header-link-artists">
          artists
        </Button>
      )}
      {showGaleryLink && (
        <Button
          onClick={async () => {
            await router.push(galleryRoute);
          }}
          sx={headerStyles.button}
          variant="contained"
          data-testid="header-link-gallery">
          galleries
        </Button>
      )}
      {/* <Link href={`/Authenticate/${AuthEnum.curators}`}>
        <Typography component="div" sx={styles.typography}>
          curators
        </Typography>
      </Link> */}
      <div />
      <div />
      <div />
      <div />
      <Box data-testid="dartaHouseBlue">
        <Image
          src="/static/images/dartahouseblue.png"
          data-testid="header-image"
          alt="me"
          width="80"
          height="64"
          onClick={() => router.push('/', undefined, {shallow: true})}
        />
      </Box>
    </Box>
  );
}
