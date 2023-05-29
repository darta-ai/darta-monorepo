import React from 'react';
import {Typography, Box} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_MILK, PRIMARY_LIGHTBLUE} from '../../../styles';
import Link from 'next/link';

const styles = {
  footerBox: {
    width: '100%',
    height: '5vh',
    bottom: 0,
    backgroundColor: PRIMARY_BLUE,
  },
  divider: {
    color: PRIMARY_MILK,
  },
  textContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '3vh',
    '@media (min-width:600px)': {
      gap: '7vh',
    },
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_MILK,
    fontSize: '0.75rem',
    '@media (min-width:600px)': {
      fontSize: '0.9rem',
    },
    '&:hover': {
      backgroundColor: PRIMARY_LIGHTBLUE,
      opacity: [0.9, 0.9, 0.9],
    },
    cursor: 'default',
  },
};

export const Footer = () => {
  return (
    <Box sx={styles.footerBox}>
      <Box sx={styles.textContainer}>
        <Link href={`/Darta/About`}>
          <Typography component="div" sx={styles.typography}>
            <div onClick={() => console.log('clicked')}>about</div>
          </Typography>
        </Link>
        <div style={styles.divider}>|</div>
        <Link href={`/Darta/Contact`}>
          <Typography component="div" sx={styles.typography}>
            contact
          </Typography>
        </Link>
        <div style={styles.divider}>|</div>
        <Typography component="div" sx={styles.typography}>
          <div onClick={() => console.log('clicked')}>terms & conditions</div>
        </Typography>
      </Box>
    </Box>
  );
};
