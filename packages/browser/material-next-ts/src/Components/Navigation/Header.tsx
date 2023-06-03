import React from 'react';
import {Typography, Box, Button} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_MILK, PRIMARY_LIGHTBLUE} from '../../../styles';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {AuthEnum} from '../Auth/types';
import {AuthContext} from '../../../pages/_app';

const styles = {
  headerBox: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '1%',
    backgroundColor: PRIMARY_BLUE,
  },
  headerLogo: {
    width: '100px',
    height: '100px',
    margin: 0,
    padding: 0,
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_MILK,
    fontSize: '1.2rem',
    '@media (min-width:800px)': {
      fontSize: '1.2rem',
    },
    '&:hover': {
      backgroundColor: PRIMARY_LIGHTBLUE,
      opacity: [0.9, 0.9, 0.9],
    },
    cursor: 'default',
  },
};

export const Header = () => {
  const router = useRouter();
  const {user} = React.useContext(AuthContext);

  const userIsAuthenticated = user !== null;
  const userIsArtist = user?.displayName === AuthEnum.artists;

  const galleryRoute = userIsAuthenticated
    ? `/Galleries/Home`
    : `/Authenticate/${AuthEnum.galleries}`;
  const artistRoute = userIsAuthenticated
    ? `/Artists/Home`
    : `/Authenticate/${AuthEnum.artists}`;

  const showArtistLink =
    (userIsArtist && userIsAuthenticated) || !userIsAuthenticated;
  const showGaleryLink =
    (!userIsArtist && userIsAuthenticated) || !userIsAuthenticated;

  return (
    <Box sx={styles.headerBox} data-testid="header-box">
      {showArtistLink && (
        <Link
          id="authenticateArtists"
          href={artistRoute}
          data-testid="header-link-artists">
          <Typography
            component="div"
            sx={styles.typography}
            data-testid="header-link-artists-text">
            artists
          </Typography>
        </Link>
      )}
      {showGaleryLink && (
        <Link
          id="authenticateGalleries"
          href={galleryRoute}
          data-testid="header-link-galleries">
          <Typography
            component="div"
            sx={styles.typography}
            data-testid="header-link-galleries-text">
            galleries
          </Typography>
        </Link>
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
      <Box data-testid="header-image-box">
        <Image
          src="/static/images/dartahouseblue.png"
          data-testid="header-image"
          alt="me"
          width="64"
          height="64"
          onClick={() => router.push('/', undefined, {shallow: true})}
        />
      </Box>
    </Box>
  );
};
