import React from 'react';
import {Typography, Box} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_MILK, PRIMARY_LIGHTBLUE} from '../../../styles';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {AuthEnum} from '../Auth/types';

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
    '@media (min-width:600px)': {
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
  return (
    <Box sx={styles.headerBox}>
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
