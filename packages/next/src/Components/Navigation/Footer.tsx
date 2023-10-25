import * as Colors from '@darta-styles'
import {Box, Typography} from '@mui/material';
import Link from 'next/link';
import React from 'react';

const styles = {
  footerBox: {
    width: '100%',
    height: '5vh',
    zIndex: 1,
    backgroundColor: Colors.PRIMARY_900,
    '@media (min-width:800px)': {
      width: '100%',
    },
  },
  divider: {
    color: Colors.PRIMARY_50,
  },
  textContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2vh',
    '@media (min-width:800px)': {
      gap: '7vh',
    },
  },
  typography: {
    fontFamily: 'Nunito Sans',
    color: Colors.PRIMARY_50,
    fontSize: '0.75rem',
    '@media (min-width:800px)': {
      fontSize: '0.9rem',
    },
    '&:hover': {
      color: Colors.PRIMARY_200,
      opacity: [0.9, 0.9, 0.9],
    },
  },
};

export function Footer() {
  return (
    <Box sx={styles.footerBox} data-testid="footer-box">
      <Box sx={styles.textContainer} data-testid="text-container">
        <Link href="/Darta/About" style={{ textDecoration: 'none' }}>
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
        <Link href="/Darta/Contact" style={{ textDecoration: 'none' }}>
          <Typography
            component="div"
            sx={styles.typography}
            data-testid="contact-link">
            contact
          </Typography>
        </Link>
        {/* <div style={styles.divider} data-testid="second-divider">
          |
        </div>
        <Typography
          component="div"
          sx={styles.typography}
          data-testid="terms-link">
          terms & conditions
        </Typography> */}
      </Box>
    </Box>
  );
}
