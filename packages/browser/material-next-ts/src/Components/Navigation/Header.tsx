import React from 'react';
import {Typography, Box, Button} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_MILK, PRIMARY_LIGHTBLUE} from '../../../styles';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {AuthEnum} from '../Auth/types';
import {
  isSignedIn,
  firebaseSignOut,
} from '../../../browserFirebase/firebaseApp';
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
  const handleSignOut = async () => {
    console.log('triggered!');
    try {
      const results = await firebaseSignOut();
      console.log({results});
      router.push('/');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box sx={styles.headerBox}>
      {user && (
        <Button
          onClick={async () => {
            await handleSignOut();
          }}
          sx={{backgroundColor: PRIMARY_MILK}}
          variant="contained">
          Sign Out
        </Button>
      )}
      <Link href={`/Authenticate/${AuthEnum.artists}`}>
        <Typography component="div" sx={styles.typography}>
          artists
        </Typography>
      </Link>
      <Link href={`/Authenticate/${AuthEnum.galleries}`}>
        <Typography component="div" sx={styles.typography}>
          galleries
        </Typography>
      </Link>
      {/* <Link href={`/Authenticate/${AuthEnum.curators}`}>
        <Typography component="div" sx={styles.typography}>
          curators
        </Typography>
      </Link> */}
      <div />
      <div />
      <div />
      <div />
      <Box>
        <Image
          src="/static/images/dartahouseblue.png"
          alt="me"
          width="64"
          height="64"
          onClick={() => router.push('/', undefined, {shallow: true})}
        />
      </Box>
    </Box>
  );
};
