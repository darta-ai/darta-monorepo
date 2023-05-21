import React from 'react';
import {Typography, Box, Link} from '@mui/material';
import {PRIMARY_BLUE, PRIMARY_MILK, PRIMARY_LIGHTBLUE} from '../../../styles';

const styles = {
  footerBox: {
    width: '100%',
    height: '35px',
    // position: 'fixed',
    bottom: 0,
    backgroundColor: PRIMARY_BLUE,
    marginTop: '100px',
  },
  divider: {
    color: PRIMARY_MILK,
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5%',
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
    cursor: 'pointer',
  },
};

export const Footer = () => {
  return (
    <Box sx={styles.footerBox}>
      <Box sx={styles.textContainer}>
        <Typography component="div" sx={styles.typography}>
          <div onClick={() => console.log('clicked')}>about</div>
        </Typography>
        <div style={styles.divider}>|</div>
        <Typography component="div" sx={styles.typography}>
          <div onClick={() => console.log('clicked')}>contact</div>
        </Typography>
        <div style={styles.divider}>|</div>
        <Typography component="div" sx={styles.typography}>
          <div onClick={() => console.log('clicked')}>terms & conditions</div>
        </Typography>
      </Box>
    </Box>
  );
};
