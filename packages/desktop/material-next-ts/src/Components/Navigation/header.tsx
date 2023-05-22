import React from 'react';
import {Typography, Box} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_MILK, PRIMARY_LIGHTBLUE} from '../../../styles';
import Image from 'next/image';

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
    cursor: 'pointer',
  },
};

export const Header = () => {
  return (
    <Box sx={styles.headerBox}>
      <Typography component="div" sx={styles.typography}>
        <div onClick={() => console.log('clicked')}>for artists</div>
      </Typography>
      <Typography component="div" sx={styles.typography}>
        <div onClick={() => console.log('clicked')}>for galleries</div>
      </Typography>
      <Typography component="div" sx={styles.typography}>
        <div onClick={() => console.log('clicked')}>for curators</div>
      </Typography>
      <div />
      <div />
      <div />
      <div />
      <Image
        src="/static/images/dartahouseblue.png"
        alt="me"
        width="64"
        height="64"
      />
    </Box>
  );
};
