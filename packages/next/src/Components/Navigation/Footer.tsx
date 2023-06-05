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
    '@media (min-width:800px)': {
      gap: '7vh',
    },
  },
  typography: {
    fontFamily: 'EB Garamond',
    color: PRIMARY_MILK,
    fontSize: '0.75rem',
    '@media (min-width:800px)': {
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
    <Box sx={styles.footerBox} data-testid="footer-box">
      <Box sx={styles.textContainer} data-testid="text-container">
        <Link href={`/Darta/About`}>
          <Typography
            component="div"
            sx={styles.typography}
            data-testid="about-link">
            about
          </Typography>
        </Link>
        <div style={styles.divider} data-testid="first-divider">
          |
        </div>
        <Link href={`/Darta/Contact`}>
          <Typography
            component="div"
            sx={styles.typography}
            data-testid="contact-link">
            contact
          </Typography>
        </Link>
        <div style={styles.divider} data-testid="second-divider">
          |
        </div>
        <Typography
          component="div"
          sx={styles.typography}
          data-testid="terms-link">
          terms & conditions
        </Typography>
      </Box>
    </Box>
  );
};
